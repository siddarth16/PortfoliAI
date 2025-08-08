import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { UserFormData, GeneratedWebsite } from '@/lib/types';

// Initialize OpenAI client lazily to avoid build-time errors
let openai: OpenAI | null = null;

function getOpenAIClient() {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not found. Please set OPENAI_API_KEY in your environment variables.');
    }
    openai = new OpenAI({
      apiKey: apiKey,
    });
  }
  return openai;
}

function buildPrompt(userData: UserFormData): string {
  // Build education text
  const educationText = userData.education.length > 0 ? userData.education.map(edu => {
    const endDate = edu.isPresent ? 'Present' : `${edu.endMonth}/${edu.endYear}`;
    return `- ${edu.degree} from ${edu.school} (${edu.startMonth}/${edu.startYear} - ${endDate})${edu.cgpa ? ` | CGPA: ${edu.cgpa}` : ''}`;
  }).join('\n') : 'No education provided yet.';

  // Build projects text
  const projectsText = userData.projects.length > 0 ? userData.projects.map(p => 
    `- ${p.title}: ${p.description} [${p.stack.join(', ')}]${p.url ? ` - Live: ${p.url}` : ''}${p.github ? ` - GitHub: ${p.github}` : ''}`
  ).join('\n') : 'No projects provided yet.';

  // Optimized prompt for GPT-5 - concise but effective
  return `Create a modern, professional portfolio website for ${userData.name}.

${userData.referenceSite ? `Design Inspiration: Study ${userData.referenceSite} and create a similar aesthetic/layout style adapted for a portfolio.` : 'Use a clean, modern design with professional styling.'}

USER DATA:
Name: ${userData.name}
Title: ${userData.title}
Skills: ${userData.skills.join(', ')}

Experience:
${userData.workHistory.map(w => {
  const endDate = w.isPresent ? 'Present' : `${w.endMonth}/${w.endYear}`;
  return `${w.position} at ${w.company} (${w.startMonth}/${w.startYear} - ${endDate}) | ${w.bullets.join('; ')}`;
}).join('\n')}

Projects:
${projectsText}

Education:
${educationText}

REQUIREMENTS:
- Single HTML file with embedded CSS/JS
- Responsive design (mobile-first)
- Professional appearance matching reference site style
- Sections: Header, Hero, About, Skills, Experience, Projects, Education, Contact
- Modern CSS (Grid/Flexbox), Google Fonts, Font Awesome icons
- Smooth animations, fast loading

Return ONLY the complete HTML code from <!DOCTYPE html> to </html>.`;
}

function parseGeneratedCode(text: string): GeneratedWebsite {
  // Extract HTML content
  const htmlMatch = text.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
  
  if (htmlMatch) {
    const htmlCode = htmlMatch[0];
    
    // Extract CSS (embedded within <style> tags)
    const cssMatches = htmlCode.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
    let cssCode = '';
    if (cssMatches) {
      cssCode = cssMatches.map(match => 
        match.replace(/<\/?style[^>]*>/gi, '')
      ).join('\n\n');
    }
    
    // Extract JavaScript (embedded within <script> tags)
    const jsMatches = htmlCode.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
    let jsCode = '';
    if (jsMatches) {
      jsCode = jsMatches.map(match => 
        match.replace(/<\/?script[^>]*>/gi, '')
      ).join('\n\n');
    }

    return {
      html: htmlCode,
      css: cssCode || '/* CSS is embedded in the HTML file */',
      js: jsCode || '/* JavaScript is embedded in the HTML file */',
      preview: htmlCode
    };
  }

  // If no HTML found, return the full text as HTML
  return {
    html: text,
    css: '/* CSS is embedded in the HTML file */',
    js: '/* JavaScript is embedded in the HTML file */',
    preview: text
  };
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting OpenAI GPT-5 generation...');

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OpenAI API key not found in server environment');
      return NextResponse.json({
        error: 'OpenAI API key not found. Please set OPENAI_API_KEY in your environment variables.'
      }, { status: 500 });
    }

    // Parse request body
    const userData: UserFormData = await request.json();
    console.log('📋 User data received for:', userData.name);

    // Build prompt
    const prompt = buildPrompt(userData);
    console.log('📝 Prompt preview:', prompt.substring(0, 200) + '...');

    // Get OpenAI client (lazy initialization)
    const openaiClient = getOpenAIClient();
    
    // Call OpenAI API
    const response = await openaiClient.chat.completions.create({
      model: 'gpt-5', // Using GPT-5 (latest and most advanced model)
      messages: [
        {
          role: 'system',
          content: 'You are an expert web developer who creates professional portfolio websites. Always return complete, valid HTML code with embedded CSS and JavaScript.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 4000, // Optimized for cost while ensuring complete websites
      temperature: 0.7, // Balanced creativity
      top_p: 0.9
    });

    console.log('✅ Received response from OpenAI');
    console.log('📊 Usage:', response.usage);

    const generatedContent = response.choices[0]?.message?.content;
    
    if (!generatedContent || generatedContent.length < 100) {
      console.error('❌ Response too short or empty from OpenAI API');
      return NextResponse.json({
        error: 'Response too short or empty from OpenAI API'
      }, { status: 500 });
    }

    console.log('✅ Generated content length:', generatedContent.length, 'characters');

    // Parse and return the generated website
    const website = parseGeneratedCode(generatedContent);
    return NextResponse.json(website);

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown OpenAI API error';
    console.error('❌ OpenAI API Error Details:', {
      message: errorMessage,
      error: error
    });

    return NextResponse.json({
      error: errorMessage
    }, { status: 500 });
  }
}
