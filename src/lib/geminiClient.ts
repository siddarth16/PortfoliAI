import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserFormData, GeneratedWebsite } from './types';

class GeminiClient {
  private genAI: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
  }

  async generateWebsite(userData: UserFormData): Promise<GeneratedWebsite> {
    if (!this.genAI) {
      // Mock response for development when API key is not set
      return this.getMockWebsite(userData);
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = this.buildPrompt(userData);
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseGeneratedCode(text);
    } catch (error) {
      console.error('Error generating website:', error);
      return this.getMockWebsite(userData);
    }
  }

  private buildPrompt(userData: UserFormData): string {
    return `
You are an expert web developer. Create a professional, mobile-responsive personal portfolio website using HTML, CSS, and JavaScript.

Base the layout/style loosely on: ${userData.referenceSite || 'modern portfolio websites'}.

User Information:
- Name: ${userData.name}
- Title: ${userData.title}
- About: ${userData.bio}
- Skills: ${userData.skills.join(', ')}

Work History:
${userData.workHistory.map(w => 
  `- ${w.position} at ${w.company} (${w.duration}): ${w.bullets.join('; ')}`
).join('\n')}

Projects:
${userData.projects.map(p => 
  `- ${p.title}: ${p.description} [${p.stack.join(', ')}]${p.url ? ` - ${p.url}` : ''}${p.github ? ` - GitHub: ${p.github}` : ''}`
).join('\n')}

Education: ${userData.education}

Requirements:
1. Create a single HTML file with inline CSS and JavaScript
2. Use modern CSS Grid and Flexbox for layout
3. Include smooth scrolling and hover effects
4. Make it mobile-responsive
5. Use a dark theme with gradient accents
6. Include sections: Hero, About, Skills, Experience, Projects, Contact
7. Add subtle animations and transitions
8. Use proper semantic HTML
9. Include meta tags for SEO

Please structure your response as:
<!DOCTYPE html>
<html>
<!-- Your complete website code here -->
</html>

Generate clean, readable code with comments explaining key sections.
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

  private getMockWebsite(userData: UserFormData): GeneratedWebsite {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${userData.name} - Portfolio</title>
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
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        header {
            padding: 2rem 0;
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
        }
        
        .hero h1 {
            font-size: 3rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1rem;
        }
        
        .hero p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
        }
        
        .section {
            padding: 4rem 0;
        }
        
        .section h2 {
            font-size: 2.5rem;
            margin-bottom: 2rem;
            text-align: center;
            color: #667eea;
        }
        
        .skills-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin: 2rem 0;
        }
        
        .skill-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: 10px;
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .skill-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
        }
        
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }
        
        .project-card {
            background: rgba(255, 255, 255, 0.1);
            padding: 2rem;
            border-radius: 15px;
            transition: transform 0.3s ease;
        }
        
        .project-card:hover {
            transform: scale(1.05);
            box-shadow: 0 15px 40px rgba(102, 126, 234, 0.3);
        }
        
        .work-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 2rem;
            margin: 1rem 0;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2rem;
            }
            
            .section h2 {
                font-size: 2rem;
            }
            
            .skills-grid,
            .projects-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <div class="hero">
                <h1>${userData.name}</h1>
                <p>${userData.title}</p>
                <p>${userData.bio}</p>
            </div>
        </div>
    </header>

    <main>
        <section class="section">
            <div class="container">
                <h2>Skills</h2>
                <div class="skills-grid">
                    ${userData.skills.map(skill => `<div class="skill-item">${skill}</div>`).join('')}
                </div>
            </div>
        </section>

        <section class="section">
            <div class="container">
                <h2>Experience</h2>
                ${userData.workHistory.map(work => `
                    <div class="work-item">
                        <h3>${work.position} at ${work.company}</h3>
                        <p><strong>${work.duration}</strong></p>
                        <ul>
                            ${work.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        </section>

        <section class="section">
            <div class="container">
                <h2>Projects</h2>
                <div class="projects-grid">
                    ${userData.projects.map(project => `
                        <div class="project-card">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            <p><strong>Tech Stack:</strong> ${project.stack.join(', ')}</p>
                            ${project.url ? `<a href="${project.url}" target="_blank">View Project</a>` : ''}
                            ${project.github ? `<a href="${project.github}" target="_blank">GitHub</a>` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <section class="section">
            <div class="container">
                <h2>Education</h2>
                <p>${userData.education}</p>
            </div>
        </section>
    </main>

    <script>
        // Smooth scrolling for any future navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Add some interactive animations
        const cards = document.querySelectorAll('.project-card, .skill-item, .work-item');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(102, 126, 234, 0.2)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(255, 255, 255, 0.1)';
            });
        });
    </script>
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