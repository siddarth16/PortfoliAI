'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download, RefreshCw, Code, Eye, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CodeEditor } from '@/components/features/CodeEditor';
import { WebsitePreview } from '@/components/features/WebsitePreview';
import { geminiClient } from '@/lib/geminiClient';
import { downloadWebsiteAsZip } from '@/lib/zipHelper';
import { UserFormData, GeneratedWebsite } from '@/lib/types';

export default function PreviewPage() {
  const [formData, setFormData] = useState<UserFormData | null>(null);
  const [generatedWebsite, setGeneratedWebsite] = useState<GeneratedWebsite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');

  useEffect(() => {
    // Load form data from localStorage
    const savedFormData = localStorage.getItem('portfoliAI_formData');
    if (savedFormData) {
      const userData: UserFormData = JSON.parse(savedFormData);
      setFormData(userData);
      generateWebsite(userData);
    } else {
      // Redirect back to form if no data
      window.location.href = '/form';
    }
  }, []);

  const generateWebsite = async (userData: UserFormData) => {
    setIsLoading(true);
    try {
      const website = await geminiClient.generateWebsite(userData);
      setGeneratedWebsite(website);
    } catch (error) {
      console.error('Error generating website:', error);
      // You could add error handling UI here
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!formData) return;
    
    setIsRegenerating(true);
    try {
      const website = await geminiClient.generateWebsite(formData);
      setGeneratedWebsite(website);
    } catch (error) {
      console.error('Error regenerating website:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedWebsite || !formData) return;
    
    try {
      await downloadWebsiteAsZip(generatedWebsite, `${formData.name.replace(/\s+/g, '-').toLowerCase()}-portfolio`);
    } catch (error) {
      console.error('Error downloading website:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-12 text-center max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="relative">
              <Sparkles className="h-16 w-16 mx-auto text-primary animate-pulse" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <Loader2 className="h-16 w-16 mx-auto text-primary/30" />
              </motion.div>
            </div>
            <h2 className="text-2xl font-bold text-gradient">Generating Your Portfolio</h2>
            <p className="text-muted-foreground">
              Our AI is crafting your personalized website...
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✨ Analyzing your experience</p>
              <p>🎨 Designing your layout</p>
              <p>⚡ Optimizing for performance</p>
            </div>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (!generatedWebsite) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-bold mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            We couldn't generate your website. Please try again.
          </p>
          <Button asChild>
            <Link href="/form">Back to Form</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">PortfoliAI</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="hidden md:flex"
              >
                {isRegenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Regenerate
              </Button>
              
              <Button onClick={handleDownload} className="glow-sm">
                <Download className="h-4 w-4 mr-2" />
                Download ZIP
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Your Portfolio is Ready! 🎉
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Review your generated website, make any adjustments, and download it to deploy anywhere.
            </p>
          </div>

          {/* Main Content */}
          <Card className="depth-2 bg-card/50 backdrop-blur-sm overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-border px-6 py-4">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="preview" className="flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    Live Preview
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex items-center">
                    <Code className="h-4 w-4 mr-2" />
                    View Code
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="preview" className="m-0">
                <WebsitePreview html={generatedWebsite.html} />
              </TabsContent>

              <TabsContent value="code" className="m-0">
                <CodeEditor 
                  html={generatedWebsite.html}
                  css={generatedWebsite.css}
                  js={generatedWebsite.js}
                />
              </TabsContent>
            </Tabs>
          </Card>

          {/* Action Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 text-center h-full tilt-card">
                <Download className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Download & Deploy</h3>
                <p className="text-muted-foreground mb-4">
                  Get your complete website files and deploy to any hosting platform.
                </p>
                <Button onClick={handleDownload} className="w-full">
                  Download ZIP
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 text-center h-full tilt-card">
                <RefreshCw className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Regenerate</h3>
                <p className="text-muted-foreground mb-4">
                  Not happy with the result? Generate a new version with different styling.
                </p>
                <Button 
                  variant="outline" 
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="w-full"
                >
                  {isRegenerating ? 'Generating...' : 'Try Again'}
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 text-center h-full tilt-card">
                <ArrowLeft className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Edit Information</h3>
                <p className="text-muted-foreground mb-4">
                  Want to update your details? Go back and modify your information.
                </p>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/form">Edit Details</Link>
                </Button>
              </Card>
            </motion.div>
          </div>

          {/* Next Steps */}
          <Card className="mt-8 p-6 bg-primary/10 border-primary/20">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              🚀 What's Next?
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Quick Deployment Options:</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• <strong>Netlify:</strong> Drag & drop your ZIP file</li>
                  <li>• <strong>Vercel:</strong> Connect your GitHub repository</li>
                  <li>• <strong>GitHub Pages:</strong> Upload to a GitHub repo</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Need Help?</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Check our <Link href="/instructions" className="text-primary hover:underline">deployment guide</Link></li>
                  <li>• Your website is mobile-responsive</li>
                  <li>• All code is clean and optimized</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}