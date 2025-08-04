'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Sparkles, Zap, Globe, Download } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Sparkles className="h-8 w-8 text-gradient" />
              <span className="text-2xl font-bold text-neon">PortfoliAI</span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center space-x-6"
            >
              <Link href="/form" className="text-muted-foreground hover:text-foreground transition-colors">
                Create Portfolio
              </Link>
              <Link href="/instructions" className="text-muted-foreground hover:text-foreground transition-colors">
                How to Deploy
              </Link>
              <Button asChild className="glow-sm">
                <Link href="/form">Get Started</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Turn Your Resume Into a{' '}
              <span className="text-neon animate-gradient-x">Website</span>{' '}
              — Instantly.
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Transform your career story into a stunning personal website using AI. 
              No coding skills required.
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button 
                asChild 
                size="lg" 
                className="text-lg px-8 py-6 glow-md gradient-primary hover:glow-lg transition-all duration-300 group"
              >
                <Link href="/form" className="flex items-center">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 border-primary/50 hover:bg-primary/10"
                asChild
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Upload. Customize. Deploy.
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powered by Advanced AI. Your professional website is just minutes away.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Zap,
                title: 'AI-Powered Generation',
                description: 'Advanced AI analyzes your resume and creates a custom website tailored to your career.',
                delay: 0.1
              },
              {
                icon: Globe,
                title: 'Professional Templates',
                description: 'Choose from modern, responsive designs that look great on all devices and impress employers.',
                delay: 0.2
              },
              {
                icon: Download,
                title: 'Instant Deployment',
                description: 'Download your complete website files and deploy to Netlify, Vercel, or GitHub Pages in seconds.',
                delay: 0.3
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.6 }}
              >
                <Card className="p-8 h-full tilt-card depth-2 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 group">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 rounded-full gradient-primary mb-6 group-hover:animate-pulse-neon transition-all duration-300">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <Card className="p-12 gradient-neon animate-gradient-x depth-3">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Ready to Build Your Portfolio?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Join thousands of professionals who&apos;ve already transformed their careers with AI-powered portfolios.
              </p>
              <Button 
                asChild 
                size="lg" 
                className="text-lg px-8 py-6 bg-white text-black hover:bg-white/90 glow-lg font-semibold"
              >
                <Link href="/form" className="flex items-center">
                  Start Building Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">PortfoliAI</span>
            </div>
            <div className="flex items-center space-x-6 text-muted-foreground">
              <Link href="/form" className="hover:text-foreground transition-colors">
                Create Portfolio
              </Link>
              <Link href="/instructions" className="hover:text-foreground transition-colors">
                Deploy Guide
              </Link>
              <span className="text-sm">Powered by AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}