'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';
import { basicInfoSchema, BasicInfoFormData } from '@/lib/formSchema';
import { UserFormData } from '@/lib/types';

interface BasicInfoStepProps {
  formData: UserFormData;
  updateFormData: (data: Partial<UserFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function BasicInfoStep({ formData, updateFormData, onNext }: BasicInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      name: formData.name,
      title: formData.title,
      bio: formData.bio,
    },
    mode: 'onChange',
  });

  const watchedData = watch();

  const onSubmit = (data: BasicInfoFormData) => {
    updateFormData(data);
    onNext();
  };

  // Auto-save as user types
  const handleFieldChange = (field: keyof BasicInfoFormData, value: string) => {
    updateFormData({ [field]: value });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <div>
          <Label htmlFor="name" className="text-lg font-medium">
            Full Name *
          </Label>
          <Input
            id="name"
            {...register('name')}
            onChange={(e) => {
              register('name').onChange(e);
              handleFieldChange('name', e.target.value);
            }}
            placeholder="John Doe"
            className="mt-2 text-lg h-12"
          />
          {errors.name && (
            <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="title" className="text-lg font-medium">
            Professional Title *
          </Label>
          <Input
            id="title"
            {...register('title')}
            onChange={(e) => {
              register('title').onChange(e);
              handleFieldChange('title', e.target.value);
            }}
            placeholder="Senior Software Engineer"
            className="mt-2 text-lg h-12"
          />
          {errors.title && (
            <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="bio" className="text-lg font-medium">
            Professional Bio *
          </Label>
          <Textarea
            id="bio"
            {...register('bio')}
            onChange={(e) => {
              register('bio').onChange(e);
              handleFieldChange('bio', e.target.value);
            }}
            placeholder="Write a compelling bio that showcases your experience, passion, and what makes you unique as a professional..."
            className="mt-2 min-h-32 text-lg"
          />
          <div className="flex justify-between items-center mt-1">
            <div>
              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio.message}</p>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {watchedData.bio?.length || 0}/500 characters
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-between pt-6"
      >
        <div /> {/* Spacer for the first step */}
        
        <Button
          type="submit"
          size="lg"
          disabled={!isValid}
          className="px-8 py-3 text-lg glow-sm group"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      {/* Progress indicator */}
      {watchedData.name && watchedData.title && watchedData.bio && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center pt-4"
        >
          <p className="text-sm text-primary">
            ✓ Looking good! Ready to continue to work experience.
          </p>
        </motion.div>
      )}
    </form>
  );
}