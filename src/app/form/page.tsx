'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { BasicInfoStep } from '@/components/features/BasicInfoStep';
import { WorkHistoryStep } from '@/components/features/WorkHistoryStep';
import { ProjectsStep } from '@/components/features/ProjectsStep';
import { SkillsEducationStep } from '@/components/features/SkillsEducationStep';
import { MediaStep } from '@/components/features/MediaStep';
import { ReferenceSiteStep } from '@/components/features/ReferenceSiteStep';

import { UserFormData } from '@/lib/types';

const TOTAL_STEPS = 6;

const initialFormData: UserFormData = {
  name: '',
  title: '',
  bio: '',
  workHistory: [],
  projects: [],
  skills: [],
  education: '',
  media: [],
  referenceSite: '',
};

export default function FormPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [isGenerating, setIsGenerating] = useState(false);

  const steps = [
    { id: 1, title: 'Basic Info', description: 'Tell us about yourself' },
    { id: 2, title: 'Work History', description: 'Your professional experience' },
    { id: 3, title: 'Projects', description: 'Showcase your work' },
    { id: 4, title: 'Skills & Education', description: 'Your expertise and background' },
    { id: 5, title: 'Media', description: 'Upload photos and videos (optional)' },
    { id: 6, title: 'Reference Site', description: 'Inspiration for your design' },
  ];

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerateWebsite = async () => {
    setIsGenerating(true);
    // Store form data in localStorage for the preview page
    localStorage.setItem('portfoliAI_formData', JSON.stringify(formData));
    
    // Simulate processing delay
    setTimeout(() => {
      window.location.href = '/preview';
    }, 1000);
  };

  const updateFormData = (stepData: Partial<UserFormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const renderCurrentStep = () => {
    const stepProps = {
      formData,
      updateFormData,
      onNext: handleNext,
      onPrevious: handlePrevious,
    };

    switch (currentStep) {
      case 1:
        return <BasicInfoStep {...stepProps} />;
      case 2:
        return <WorkHistoryStep {...stepProps} />;
      case 3:
        return <ProjectsStep {...stepProps} />;
      case 4:
        return <SkillsEducationStep {...stepProps} />;
      case 5:
        return <MediaStep {...stepProps} />;
      case 6:
        return <ReferenceSiteStep {...stepProps} onGenerate={handleGenerateWebsite} isGenerating={isGenerating} />;
      default:
        return null;
    }
  };

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
            
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Step {currentStep} of {TOTAL_STEPS}
              </span>
              <div className="w-32">
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress for mobile */}
      <div className="md:hidden px-4 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Navigation */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Step indicators */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2 overflow-x-auto pb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 text-sm font-medium transition-all duration-300 ${
                      step.id <= currentStep
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-border text-muted-foreground'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {step.id}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                        step.id < currentStep ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current step info */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">
              {steps[currentStep - 1].title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {steps[currentStep - 1].description}
            </p>
          </motion.div>

          {/* Step content */}
          <Card className="p-8 depth-2 bg-card/50 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderCurrentStep()}
              </motion.div>
            </AnimatePresence>
          </Card>

          {/* Navigation buttons - will be rendered by step components */}
        </div>
      </div>
    </div>
  );
}