'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Plus, X } from 'lucide-react';
import { skillsEducationSchema, SkillsEducationFormData } from '@/lib/formSchema';
import { UserFormData } from '@/lib/types';

interface SkillsEducationStepProps {
  formData: UserFormData;
  updateFormData: (data: Partial<UserFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function SkillsEducationStep({ formData, updateFormData, onNext, onPrevious }: SkillsEducationStepProps) {
  const [currentSkill, setCurrentSkill] = useState('');
  const [skills, setSkills] = useState<string[]>(formData.skills || []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<SkillsEducationFormData>({
    resolver: zodResolver(skillsEducationSchema),
    defaultValues: {
      skills: formData.skills,
      education: formData.education,
    },
    mode: 'onChange',
  });

  const watchedEducation = watch('education');

  const onSubmit = (data: SkillsEducationFormData) => {
    updateFormData({ ...data, skills });
    onNext();
  };

  const addSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      const newSkills = [...skills, currentSkill.trim()];
      setSkills(newSkills);
      setValue('skills', newSkills);
      setCurrentSkill('');
      updateFormData({ skills: newSkills });
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const newSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(newSkills);
    setValue('skills', newSkills);
    updateFormData({ skills: newSkills });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const suggestedSkills = [
    'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
    'AWS', 'Docker', 'Kubernetes', 'Git', 'SQL', 'MongoDB',
    'Vue.js', 'Angular', 'Express.js', 'PostgreSQL', 'Redis',
    'GraphQL', 'REST APIs', 'CI/CD', 'Agile', 'Scrum'
  ];

  const availableSuggestions = suggestedSkills.filter(skill => 
    !skills.includes(skill) && 
    skill.toLowerCase().includes(currentSkill.toLowerCase())
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Skills Section */}
        <div>
          <Label className="text-lg font-medium mb-4 block">
            Technical Skills *
          </Label>
          
          {/* Current Skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Add Skill Input */}
          <div className="flex gap-2">
            <Input
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a skill (e.g., React, Python, AWS)"
              className="flex-1"
            />
            <Button
              type="button"
              onClick={addSkill}
              disabled={!currentSkill.trim()}
              variant="outline"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Suggested Skills */}
          {currentSkill && availableSuggestions.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-muted-foreground mb-2">Suggestions:</p>
              <div className="flex flex-wrap gap-1">
                {availableSuggestions.slice(0, 8).map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      setCurrentSkill(skill);
                      setTimeout(() => addSkill(), 0);
                    }}
                    className="text-xs bg-muted hover:bg-muted/80 px-2 py-1 rounded transition-colors"
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Skills Quick Add */}
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">Popular skills:</p>
            <div className="flex flex-wrap gap-1">
              {suggestedSkills.slice(0, 12).filter(skill => !skills.includes(skill)).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => {
                    const newSkills = [...skills, skill];
                    setSkills(newSkills);
                    setValue('skills', newSkills);
                    updateFormData({ skills: newSkills });
                  }}
                  className="text-xs bg-secondary hover:bg-secondary/80 px-2 py-1 rounded transition-colors"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>

          {errors.skills && (
            <p className="text-sm text-destructive mt-2">{errors.skills.message}</p>
          )}
        </div>

        {/* Education Section */}
        <div>
          <Label htmlFor="education" className="text-lg font-medium">
            Education *
          </Label>
          <Textarea
            id="education"
            {...register('education')}
            onChange={(e) => {
              register('education').onChange(e);
              updateFormData({ education: e.target.value });
            }}
            placeholder="Bachelor of Science in Computer Science, University of Technology (2016-2020)&#10;&#10;Relevant coursework: Data Structures, Algorithms, Software Engineering..."
            className="mt-2 min-h-32"
          />
          {errors.education && (
            <p className="text-sm text-destructive mt-1">{errors.education.message}</p>
          )}
        </div>
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
          className="px-8 py-3 text-lg"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        
        <Button
          type="submit"
          size="lg"
          disabled={!isValid || skills.length === 0}
          className="px-8 py-3 text-lg glow-sm group"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      {/* Progress indicator */}
      {skills.length > 0 && watchedEducation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center pt-4"
        >
          <p className="text-sm text-primary">
            ✓ Great! You&apos;ve added {skills.length} skill{skills.length !== 1 ? 's' : ''} and your education info.
          </p>
        </motion.div>
      )}
    </form>
  );
}