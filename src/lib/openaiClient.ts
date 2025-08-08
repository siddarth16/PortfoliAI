import OpenAI from 'openai';
import { UserFormData, GeneratedWebsite } from './types';

class OpenAIClient {
  private client: OpenAI | null = null;
  private initialized = false;

  private initializeIfNeeded() {
    if (this.initialized) return;

    // Get API key from environment
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    
    console.log('🔑 OpenAI API Key check:', apiKey ? `Found (${apiKey.substring(0, 8)}...)` : 'Not found');
    
    if (!apiKey) {
      console.error('❌ OpenAI API key not found. Please set OPENAI_API_KEY in your environment variables.');
      throw new Error('OpenAI API key not found');
    }

    this.client = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Required for client-side usage
    });

    this.initialized = true;
    console.log('✅ OpenAI client initialized successfully');
  }

  async generateWebsite(userData: UserFormData): Promise<GeneratedWebsite> {
    try {
      this.initializeIfNeeded();
      
      if (!this.client) {
        throw new Error('OpenAI client not initialized');
      }

      console.log('🚀 Starting OpenAI GPT-4 generation...');
      
      const prompt = this.buildPrompt(userData);
      console.log('📝 Prompt preview:', prompt.substring(0, 200) + '...');

      const response = await this.client.chat.completions.create({
        model: 'gpt-4o', // Using GPT-4 Omni (most capable current model)
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
        return this.getMockWebsiteWithError('Response too short or empty from OpenAI API');
      }

      console.log('✅ Generated content length:', generatedContent.length, 'characters');

      return this.parseGeneratedCode(generatedContent);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown OpenAI API error';
      console.error('❌ OpenAI API Error Details:', {
        message: errorMessage,
        error: error
      });

      return this.getMockWebsiteWithError(errorMessage);
    }
  }

  private buildPrompt(userData: UserFormData): string {
    // Build education text
    const educationText = userData.education.length > 0 ? userData.education.map(edu => {
      const endDate = edu.isPresent ? 'Present' : `${edu.endMonth}/${edu.endYear}`;
      return `- ${edu.degree} from ${edu.school} (${edu.startMonth}/${edu.startYear} - ${endDate})${edu.cgpa ? ` | CGPA: ${edu.cgpa}` : ''}`;
    }).join('\n') : 'No education provided yet.';

    // Build projects text
    const projectsText = userData.projects.length > 0 ? userData.projects.map(p => 
      `- ${p.title}: ${p.description} [${p.stack.join(', ')}]${p.url ? ` - Live: ${p.url}` : ''}${p.github ? ` - GitHub: ${p.github}` : ''}`
    ).join('\n') : 'No projects provided yet.';

    // Optimized prompt for GPT-4 - concise but effective
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

  private parseGeneratedCode(text: string): GeneratedWebsite {
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

  private getMockWebsiteWithError(errorMessage: string): GeneratedWebsite {
    const errorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OpenAI API Setup Required</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
            padding: 20px;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 600px;
            text-align: center;
        }
        .error-icon {
            font-size: 48px;
            margin-bottom: 20px;
        }
        h1 {
            color: #e74c3c;
            margin-bottom: 20px;
        }
        .error-details {
            background: #f8f9fa;
            border-left: 4px solid #e74c3c;
            padding: 15px;
            margin: 20px 0;
            text-align: left;
            border-radius: 4px;
        }
        .setup-steps {
            text-align: left;
            margin: 20px 0;
        }
        .setup-steps li {
            margin: 10px 0;
            padding: 5px 0;
        }
        .env-var {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 10px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error-icon">🚨</div>
        <h1>OpenAI API Configuration Required</h1>
        <p>The website generation failed due to OpenAI API configuration issues.</p>
        
        <div class="error-details">
            <strong>Error:</strong> ${errorMessage}
        </div>

        <h3>Setup Instructions:</h3>
        <ol class="setup-steps">
            <li>Get your OpenAI API key from <a href="https://platform.openai.com/api-keys" target="_blank">https://platform.openai.com/api-keys</a></li>
            <li>In Vercel, go to your project settings → Environment Variables</li>
            <li>Add this environment variable:</li>
        </ol>
        
        <div class="env-var">
            OPENAI_API_KEY=your_openai_api_key_here
        </div>
        
        <p><strong>Note:</strong> After adding the environment variable, redeploy your application for changes to take effect.</p>
        
        <p>Once configured, try generating your website again!</p>
    </div>
</body>
</html>`;

    return {
      html: errorHtml,
      css: '/* Error page CSS is embedded in HTML */',
      js: '/* No JavaScript needed for error page */',
      preview: errorHtml
    };
  }
}

export const openaiClient = new OpenAIClient();
