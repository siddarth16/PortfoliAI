'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ExternalLink, Download, Github, Globe, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const deploymentOptions = [
  {
    name: 'Netlify',
    icon: Globe,
    difficulty: 'Easiest',
    time: '2 minutes',
    description: 'Simply drag and drop your ZIP file to deploy instantly.',
    steps: [
      'Go to netlify.com and sign up for free',
      'Drag your downloaded ZIP file to the deploy area',
      'Your site goes live automatically with a custom URL',
      'Optional: Connect a custom domain'
    ],
    pros: ['No technical knowledge required', 'Automatic SSL', 'Global CDN', 'Form handling'],
    url: 'https://netlify.com'
  },
  {
    name: 'Vercel',
    icon: Zap,
    difficulty: 'Easy',
    time: '3 minutes',
    description: 'Perfect for developers, with GitHub integration and lightning-fast performance.',
    steps: [
      'Sign up at vercel.com with your GitHub account',
      'Create a new repository and upload your files',
      'Import the repository in Vercel',
      'Deploy with one click'
    ],
    pros: ['Excellent performance', 'GitHub integration', 'Analytics included', 'Edge functions'],
    url: 'https://vercel.com'
  },
  {
    name: 'GitHub Pages',
    icon: Github,
    difficulty: 'Medium',
    time: '5 minutes',
    description: 'Free hosting directly from your GitHub repository.',
    steps: [
      'Create a new repository on GitHub',
      'Upload your portfolio files to the repository',
      'Go to Settings > Pages',
      'Select main branch as source and save'
    ],
    pros: ['Completely free', 'Version control included', 'Custom domains supported', 'No time limits'],
    url: 'https://pages.github.com'
  }
];

const additionalOptions = [
  { name: 'Firebase Hosting', url: 'https://firebase.google.com/products/hosting' },
  { name: 'Surge.sh', url: 'https://surge.sh' },
  { name: 'Render', url: 'https://render.com' },
  { name: 'Railway', url: 'https://railway.app' },
];

export default function InstructionsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">PortfoliAI</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/form">Create Portfolio</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              Deploy Your Portfolio
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get your AI-generated portfolio live on the web in minutes. Choose from these popular hosting platforms.
            </p>
          </div>

          {/* Quick Start */}
          <Card className="p-6 mb-8 bg-primary/10 border-primary/20">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Download className="h-6 w-6 mr-2 text-primary" />
              First Step: Download Your Portfolio
            </h2>
            <p className="text-muted-foreground mb-4">
              Before deploying, make sure you&apos;ve downloaded your portfolio ZIP file from the preview page.
            </p>
            <Button asChild className="glow-sm">
              <Link href="/form">
                Create Portfolio
              </Link>
            </Button>
          </Card>

          {/* Deployment Options */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-8">
              Choose Your Deployment Platform
            </h2>

            {deploymentOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.div
                  key={option.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-8 tilt-card depth-2 hover:depth-3 transition-all duration-300">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Header */}
                      <div className="md:col-span-3 flex items-center justify-between border-b border-border pb-4">
                        <div className="flex items-center space-x-4">
                          <div className="p-3 rounded-full bg-primary/10">
                            <Icon className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">{option.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-800 dark:text-green-100">
                                {option.difficulty}
                              </span>
                              <span>⏱️ {option.time}</span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" asChild>
                          <a href={option.url} target="_blank" rel="noopener noreferrer">
                            Visit Site
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                        </Button>
                      </div>

                      {/* Description */}
                      <div className="md:col-span-3">
                        <p className="text-lg text-muted-foreground mb-6">
                          {option.description}
                        </p>
                      </div>

                      {/* Steps */}
                      <div className="md:col-span-2">
                        <h4 className="font-semibold mb-3">Step-by-Step Guide:</h4>
                        <ol className="space-y-2">
                          {option.steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start">
                              <span className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-medium mr-3 mt-0.5 flex-shrink-0">
                                {stepIndex + 1}
                              </span>
                              <span className="text-muted-foreground">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Pros */}
                      <div>
                        <h4 className="font-semibold mb-3">Why Choose {option.name}:</h4>
                        <ul className="space-y-2">
                          {option.pros.map((pro, proIndex) => (
                            <li key={proIndex} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12"
          >
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Other Great Options</h3>
              <p className="text-muted-foreground mb-4">
                These platforms also offer excellent hosting for static websites:
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {additionalOptions.map((option) => (
                  <Button
                    key={option.name}
                    variant="outline"
                    asChild
                    className="justify-start"
                  >
                    <a href={option.url} target="_blank" rel="noopener noreferrer">
                      {option.name}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <Card className="p-6 bg-secondary/10">
              <h3 className="text-xl font-semibold mb-4">💡 Pro Tips</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <ul className="space-y-2">
                  <li>• Always test your site on mobile devices</li>
                  <li>• Consider buying a custom domain for professionalism</li>
                  <li>• Update your portfolio regularly with new projects</li>
                </ul>
                <ul className="space-y-2">
                  <li>• Enable HTTPS for security (most platforms do this automatically)</li>
                  <li>• Add Google Analytics to track visitors</li>
                  <li>• Share your portfolio URL on LinkedIn and resume</li>
                </ul>
              </div>
            </Card>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-12"
          >
            <Card className="p-8 gradient-primary">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Share Your Story?
              </h2>
              <p className="text-white/90 mb-6 max-w-xl mx-auto">
                Create your AI-powered portfolio in minutes and get it live on the web today.
              </p>
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link href="/form">
                  Build My Portfolio
                </Link>
              </Button>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}