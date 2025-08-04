'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Sparkles, ExternalLink, Loader2 } from 'lucide-react';
import { referenceSiteSchema, ReferenceSiteFormData } from '@/lib/formSchema';
import { UserFormData } from '@/lib/types';

interface ReferenceSiteStepProps {
  formData: UserFormData;
  updateFormData: (data: Partial<UserFormData>) => void;
  onPrevious: () => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const popularSites = [
  {
    name: 'Brittany Chiang',
    url: 'https://brittanychiang.com',
    description: 'Clean, modern developer portfolio with excellent typography'
  },
  {
    name: 'Josh Comeau',
    url: 'https://joshwcomeau.com',
    description: 'Interactive and playful design with smooth animations'
  },
  {
    name: 'Sarah Drasner',
    url: 'https://sarah.dev',
    description: 'Professional layout with strong visual hierarchy'
  },
  {
    name: 'Cassie Evans',
    url: 'https://cassie.codes',
    description: 'Creative and artistic approach with unique animations'
  }
];

export function ReferenceSiteStep({ 
  formData, 
  updateFormData, 
  onPrevious, 
  onGenerate, 
  isGenerating 
}: ReferenceSiteStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ReferenceSiteFormData>({
    resolver: zodResolver(referenceSiteSchema),
    defaultValues: {
      referenceSite: formData.referenceSite,
    },
    mode: 'onChange',
  });

  const watchedUrl = watch('referenceSite');

  const onSubmit = (data: ReferenceSiteFormData) => {
    updateFormData(data);
    onGenerate();
  };

  const selectReferenceSite = (url: string) => {
    setValue('referenceSite', url);
    updateFormData({ referenceSite: url });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="text-center">
          <p className="text-muted-foreground">
            Choose a reference website to inspire your portfolio design, or leave blank for a default modern style.
          </p>
        </div>

        {/* Manual URL Input */}
        <Card className="p-6 bg-muted/30">
          <Label htmlFor="referenceSite" className="text-lg font-medium">
            Reference Website URL (Optional)
          </Label>
          <Input
            id="referenceSite"
            {...register('referenceSite')}
            onChange={(e) => {
              register('referenceSite').onChange(e);
              updateFormData({ referenceSite: e.target.value });
            }}
            placeholder="https://example-portfolio.com"
            className="mt-2 text-lg h-12"
          />
          {errors.referenceSite && (
            <p className="text-sm text-destructive mt-1">{errors.referenceSite.message}</p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            Enter the URL of a portfolio website you admire for design inspiration
          </p>
        </Card>

        {/* Popular Examples */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Popular Portfolio Examples</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {popularSites.map((site, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`p-4 cursor-pointer transition-all duration-200 hover:border-primary/50 ${
                    watchedUrl === site.url ? 'border-primary bg-primary/10' : ''
                  }`}
                  onClick={() => selectReferenceSite(site.url)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-lg mb-1">{site.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {site.description}
                      </p>
                      <p className="text-xs text-primary">
                        {site.url}
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground ml-2" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Form Summary */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            Ready to Generate Your Portfolio!
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-foreground">Your Information:</p>
              <ul className="text-muted-foreground space-y-1 mt-1">
                <li>• Name: {formData.name || 'Not provided'}</li>
                <li>• Title: {formData.title || 'Not provided'}</li>
                <li>• Work Experience: {formData.workHistory.length} position{formData.workHistory.length !== 1 ? 's' : ''}</li>
                <li>• Projects: {formData.projects.length} project{formData.projects.length !== 1 ? 's' : ''}</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-foreground">Additional Details:</p>
              <ul className="text-muted-foreground space-y-1 mt-1">
                <li>• Skills: {formData.skills.length} skill{formData.skills.length !== 1 ? 's' : ''}</li>
                <li>• Education: {formData.education ? 'Provided' : 'Not provided'}</li>
                <li>• Media Files: {formData.media.length} file{formData.media.length !== 1 ? 's' : ''}</li>
                <li>• Reference Site: {watchedUrl ? 'Selected' : 'Default style'}</li>
              </ul>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between pt-6"
      >
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onPrevious}
          disabled={isGenerating}
          className="px-8 py-3 text-lg"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        
        <Button
          type="submit"
          size="lg"
          disabled={isGenerating}
          className="px-8 py-4 text-lg glow-md gradient-neon hover:glow-lg transition-all duration-300 min-w-48"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Generate My Website
            </>
          )}
        </Button>
      </motion.div>

      {/* Confirmation message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center pt-4"
      >
        <p className="text-sm text-primary">
          🎉 All set! Click &quot;Generate My Website&quot; to create your AI-powered portfolio.
        </p>
      </motion.div>
    </form>
  );
}