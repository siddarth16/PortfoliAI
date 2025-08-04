import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { UserFormData, GeneratedWebsite } from './types';

class GeminiClient {
  private genAI: GoogleGenerativeAI | null = null;
  private apiKey: string | null = null;
  private initialized: boolean = false;

  private initializeIfNeeded() {
    if (this.initialized) return;

    // Get API key at runtime (works in production/Vercel)
    this.apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || null;
    
    if (this.apiKey) {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      console.log('✅ Gemini API initialized successfully');
    } else {
      console.log('⚠️ No Gemini API key found in environment variables');
    }
    
    this.initialized = true;
  }

  async generateWebsite(userData: UserFormData): Promise<GeneratedWebsite> {
    // Initialize at runtime, not at build time
    this.initializeIfNeeded();

    if (!this.genAI || !this.apiKey) {
      console.log('🔑 No API key available - this should not happen in production');
      return this.getMockWebsite(userData);
    }

    try {
      console.log('🚀 Starting Gemini 1.5 Flash generation...');
      
      // Use Gemini 1.5 Flash (stable and widely available)
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: {
          temperature: 0.7,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
        ],
      });
      
      const prompt = this.buildPrompt(userData);
      console.log('📝 Generated prompt length:', prompt.length, 'characters');
      console.log('📋 Prompt preview (first 500 chars):', prompt.substring(0, 500));
      
      // Check for potentially problematic content
      if (prompt.length > 100000) {
        console.warn('⚠️ Prompt is very long:', prompt.length, 'characters - this might cause issues');
      }
      
      console.log('📞 Calling Gemini API...');
      const result = await model.generateContent(prompt);
      console.log('📨 Raw result received:', !!result);
      
      const response = await result.response;
      console.log('📋 Response object:', !!response);
      
      if (!response) {
        throw new Error('No response received from Gemini API');
      }
      
      // Check if response has candidates
      const candidates = response.candidates;
      console.log('👥 Response candidates:', candidates?.length || 0);
      
      if (!candidates || candidates.length === 0) {
        throw new Error('No candidates in Gemini response - possible content policy violation');
      }
      
      const text = response.text();
      console.log('✅ Received response from Gemini, length:', text.length, 'characters');
      console.log('📝 Response preview:', text.substring(0, 100), '...');
      
      if (!text || text.length < 100) {
        console.error('🔍 Full response object:', JSON.stringify(response, null, 2));
        throw new Error(`Response too short or empty from Gemini API. Length: ${text?.length}, Content: "${text}"`);
      }
      
      return this.parseGeneratedCode(text);
    } catch (error: unknown) {
      console.error('❌ Gemini API Error Details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        status: (error as { status?: number }).status,
        statusText: (error as { statusText?: string }).statusText,
        details: (error as { details?: unknown }).details,
        stack: error instanceof Error ? error.stack : undefined,
        errorType: typeof error,
        fullError: error,
      });
      
      // If it's a Google API error, let's see the full structure
      if (error && typeof error === 'object' && 'response' in error) {
        console.error('🔍 Google API Error Response:', error);
      }
      
      // Return mock with detailed error info for debugging
      return this.getMockWebsiteWithError(userData, error);
    }
  }

  private buildPrompt(userData: UserFormData): string {
    const educationText = userData.education.map(edu => {
      const endDate = edu.isPresent ? 'Present' : `${edu.endMonth}/${edu.endYear}`;
      return `- ${edu.degree} from ${edu.school} (${edu.startMonth}/${edu.startYear} - ${endDate}) - CGPA: ${edu.cgpa}`;
    }).join('\n');

    const projectsText = userData.projects.length > 0 ? userData.projects.map(p => 
      `- ${p.title}: ${p.description} [${p.stack.join(', ')}]${p.url ? ` - Live: ${p.url}` : ''}${p.github ? ` - GitHub: ${p.github}` : ''}`
    ).join('\n') : 'No projects provided yet.';

    return `
You are an expert web designer and developer. Your task is to create a stunning, COMPLETELY UNIQUE personal portfolio website that showcases true creativity and innovation.

🎯 CRITICAL DESIGN MISSION:
${userData.referenceSite ? `
FIRST: Study and analyze this reference website: ${userData.referenceSite}

Carefully examine:
- Layout structure and composition
- Color palette and visual hierarchy  
- Typography choices and font pairings
- Navigation style and user flow
- Visual elements and design patterns
- Spacing, proportions, and balance
- Interactive elements and animations
- Overall aesthetic and mood

THEN: Create an INSPIRED VARIATION that captures the essence and quality of this design while making it completely personalized for ${userData.name}.

DO NOT copy exactly, but CREATE A MODERN INTERPRETATION that feels cohesive with the reference style while being distinctly unique.
` : `
Create a cutting-edge, innovative portfolio design that breaks away from typical templates. Focus on creating something that would impress design professionals and stand out in a competitive market.
`}

🚫 WHAT TO AVOID:
- Generic template-like designs
- Cookie-cutter layouts you'd find on template sites
- Overused gradient backgrounds unless they match the reference style
- Basic card layouts without innovation
- Predictable sections with no creative flair

✨ INNOVATION REQUIREMENTS:
- Surprise me with creative layout solutions
- Use unexpected but tasteful design elements
- Create memorable visual experiences
- Show exceptional attention to detail
- Make every section feel intentionally designed

📋 USER INFORMATION:
Name: ${userData.name}
Professional Title: ${userData.title}
Skills: ${userData.skills.join(', ')}

Work Experience:
${userData.workHistory.map(w => {
  const endDate = w.isPresent ? 'Present' : `${w.endMonth}/${w.endYear}`;
  return `- ${w.position} at ${w.company} (${w.startMonth}/${w.startYear} - ${endDate})\n  Key Achievements: ${w.bullets.join('; ')}`;
}).join('\n')}

Projects Portfolio:
${projectsText}

Educational Background:
${educationText}

🎨 DESIGN EXECUTION:
1. **HTML Structure**: Single file with embedded CSS and JavaScript
2. **Responsive Design**: Flawless mobile-first approach with seamless breakpoints
3. **Performance**: Optimized loading, smooth animations, efficient code
4. **Accessibility**: Proper semantic HTML5, ARIA labels, keyboard navigation
5. **SEO**: Comprehensive meta tags, structured data, optimal HTML structure

🏗️ REQUIRED SECTIONS (Make Each Unique):
- **Header/Navigation**: Creative, functional navigation that fits the design theme
- **Hero Section**: Memorable first impression with ${userData.name}'s name and ${userData.title}
- **About/Professional Summary**: Compelling narrative section
- **Skills Showcase**: Innovative visual representation of technical abilities  
- **Experience Timeline**: Creative presentation of work history
- **Projects Gallery**: Engaging showcase of work with clear calls-to-action
- **Education**: Elegant display of educational achievements
- **Contact/Connect**: Professional contact information and social links

⚡ TECHNICAL EXCELLENCE:
- Modern CSS (Grid, Flexbox, Custom Properties)
- Smooth micro-interactions and purposeful animations
- Google Fonts integration with thoughtful typography
- Icon system (Font Awesome or SVG icons)
- Cross-browser compatibility
- Optimized performance

🎯 OUTPUT REQUIREMENTS:
Provide ONLY the complete HTML code starting with <!DOCTYPE html> and ending with </html>.
No explanations, no markdown formatting, no comments outside the code.

The final result should be a portfolio that:
- Looks professionally designed by a top-tier agency
- Reflects ${userData.name}'s personal brand and ${userData.title} expertise
- Creates a memorable user experience
- Demonstrates exceptional web design skills
- Would stand out among hundreds of other portfolios

Create something extraordinary that ${userData.name} would be proud to showcase to potential employers or clients.
`;
  }

  private parseGeneratedCode(text: string): GeneratedWebsite {
    // Extract HTML content
    const htmlMatch = text.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
    const html = htmlMatch ? htmlMatch[0] : text;
    
    // For now, we'll return the complete HTML since Gemini generates inline CSS/JS
    return {
      html,
      css: '', // CSS is inline in the HTML
      js: '',  // JS is inline in the HTML
      preview: html
    };
  }

  private getMockWebsiteWithError(userData: UserFormData, error: unknown): GeneratedWebsite {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${userData.name} - Portfolio (Debug Mode)</title>
    <style>
        body { font-family: Arial, sans-serif; background: #1a1a1a; color: #fff; padding: 20px; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; }
        .error { background: #ff4444; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .debug { background: #333; padding: 15px; border-radius: 8px; margin: 20px 0; font-family: monospace; }
        .highlight { color: #ffd700; font-weight: bold; }
        .steps { background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .steps ol { margin: 10px 0; }
        .steps li { margin: 8px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 Gemini API Debug Mode</h1>
        <h2>Portfolio for <span class="highlight">${userData.name}</span></h2>
        
        <div class="error">
            <h3>❌ API Error Detected</h3>
            <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
            ${(error as { status?: number }).status ? `<p><strong>Status:</strong> ${(error as { status?: number }).status}</p>` : ''}
            ${(error as { details?: unknown }).details ? `<p><strong>Details:</strong> ${JSON.stringify((error as { details?: unknown }).details)}</p>` : ''}
        </div>

        <div class="steps">
            <h3>🔧 How to Fix This:</h3>
            <ol>
                <li><strong>Production Issue:</strong>
                    <br>• The NEXT_PUBLIC_GEMINI_API_KEY environment variable should be set in Vercel
                    <br>• Check Vercel dashboard → Project Settings → Environment Variables
                    <br>• Ensure the variable is set for Production environment
                </li>
                <li><strong>Debug Information:</strong>
                    <br>• API key available: ${this.apiKey ? 'Yes' : 'No'}
                    <br>• Environment: ${typeof window !== 'undefined' ? 'Client' : 'Server'}
                    <br>• Build time: ${new Date().toISOString()}
                </li>
            </ol>
        </div>

        <div class="debug">
            <h3>📊 Current Data Ready for Generation:</h3>
            <p>✓ Name: ${userData.name}</p>
            <p>✓ Title: ${userData.title}</p>
            <p>✓ Skills: ${userData.skills.length} skills</p>
            <p>✓ Work Experience: ${userData.workHistory.length} entries</p>
            <p>✓ Projects: ${userData.projects.length} projects</p>
            <p>✓ Education: ${userData.education.length} entries</p>
            ${userData.referenceSite ? `<p>✓ Reference Site: ${userData.referenceSite}</p>` : ''}
        </div>

        <div class="steps">
            <p><strong>🎯 Once fixed:</strong> Your unique portfolio will be generated using Gemini 2.5 Flash with all your data!</p>
        </div>
    </div>
</body>
</html>`;
    
    return { html, css: '', js: '', preview: html };
  }

  private getMockWebsite(userData: UserFormData): GeneratedWebsite {
    // When API key is not provided, return a notice instead of a template
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${userData.name} - Portfolio (Preview)</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            color: #ffffff;
            line-height: 1.6;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .container {
            max-width: 600px;
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        h1 {
            font-size: 2.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
        }
        
        h2 {
            color: #667eea;
            margin-bottom: 1rem;
        }
        
        p {
            font-size: 1.1rem;
            margin-bottom: 1rem;
            color: rgba(255, 255, 255, 0.9);
        }
        
        .info-box {
            background: rgba(255, 255, 255, 0.05);
            padding: 1.5rem;
            border-radius: 10px;
            margin: 1.5rem 0;
            border-left: 4px solid #667eea;
        }
        
        .highlight {
            color: #ffd700;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>AI Portfolio Generator</h1>
        <h2>Preview Mode</h2>
        <p>Your portfolio is ready to be generated for <span class="highlight">${userData.name}</span></p>
        
        <div class="info-box">
            <p><strong>API Configuration Issue:</strong></p>
            <p>The Gemini API key is not accessible. This should not happen in production deployment.</p>
        </div>
        
        <p>The AI will create a completely custom website based on:</p>
        <ul style="text-align: left; max-width: 400px; margin: 0 auto;">
            <li>✓ Your professional title: ${userData.title}</li>
            <li>✓ ${userData.skills.length} technical skills</li>
            <li>✓ ${userData.workHistory.length} work experience entries</li>
            <li>✓ ${userData.projects.length} project showcases</li>
            <li>✓ ${userData.education.length} education entries</li>
            ${userData.referenceSite ? `<li>✓ Design inspired by: ${userData.referenceSite}</li>` : ''}
        </ul>
        
        <div class="info-box">
            <p><strong>No templates!</strong> Every website is uniquely generated by AI to match your professional brand.</p>
        </div>
    </div>
</body>
</html>`;

    return {
      html,
      css: '',
      js: '',
      preview: html
    };
  }
}

export const geminiClient = new GeminiClient();