import { GoogleGenerativeAI } from '@google/generative-ai';
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
      });
      
      const prompt = this.buildPrompt(userData);
      console.log('📝 Generated prompt length:', prompt.length, 'characters');
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      if (!response) {
        throw new Error('No response received from Gemini API');
      }
      
      const text = response.text();
      console.log('✅ Received response from Gemini, length:', text.length, 'characters');
      
      if (!text || text.length < 100) {
        throw new Error('Response too short or empty from Gemini API');
      }
      
      return this.parseGeneratedCode(text);
    } catch (error: unknown) {
      console.error('❌ Gemini API Error Details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        status: (error as { status?: number }).status,
        statusText: (error as { statusText?: string }).statusText,
        details: (error as { details?: unknown }).details,
        stack: error instanceof Error ? error.stack : undefined,
      });
      
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
You are a professional web developer tasked with creating a stunning, modern personal portfolio website. This website should be production-ready and showcase the user's professional brand effectively.

IMPORTANT: Create a completely unique design. Do NOT use templates. Generate original, modern code.

User Information:
- Name: ${userData.name}
- Professional Title: ${userData.title}
- Skills: ${userData.skills.join(', ')}

Work Experience:
${userData.workHistory.map(w => {
  const endDate = w.isPresent ? 'Present' : `${w.endMonth}/${w.endYear}`;
  return `- ${w.position} at ${w.company} (${w.startMonth}/${w.startYear} - ${endDate})\n  Achievements: ${w.bullets.join('; ')}`;
}).join('\n')}

Projects:
${projectsText}

Education:
${educationText}

Design Inspiration: ${userData.referenceSite || 'Modern, clean design with dark theme and gradient accents'}

REQUIREMENTS:
1. Create a single HTML file with embedded CSS and JavaScript
2. Use a modern dark theme with gradient accents (purple/blue/pink gradients)
3. Include smooth scrolling animations and hover effects
4. Make it fully responsive (mobile-first approach)
5. Use CSS Grid and Flexbox for layout
6. Include these sections in order:
   - Header with navigation
   - Hero section with name, title, and call-to-action
   - About section with a professional summary
   - Skills section with visual skill indicators
   - Experience section with timeline or cards
   - Projects section with project showcases
   - Education section
   - Contact section with links
7. Add subtle CSS animations and transitions
8. Use proper semantic HTML5 elements
9. Include responsive navigation (hamburger menu on mobile)
10. Add proper meta tags for SEO
11. Use modern fonts (Google Fonts)
12. Include Font Awesome or similar icons

DESIGN STYLE:
- Dark background with gradient overlays
- Cards with subtle shadows and hover effects
- Smooth transitions and animations
- Modern typography with good hierarchy
- Professional color scheme
- Clean, minimalist design
- Interactive elements

OUTPUT FORMAT:
Provide ONLY the complete HTML code starting with <!DOCTYPE html> and ending with </html>. Do not include any explanations or markdown formatting.

Generate a unique, modern portfolio that stands out and represents the user professionally.
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