'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Plus, X, Trash2 } from 'lucide-react';
import { skillsEducationSchema, SkillsEducationFormData } from '@/lib/formSchema';
import { UserFormData } from '@/lib/types';
import { MONTHS, getYearOptions } from '@/lib/dateConstants';

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
    control,
  } = useForm<SkillsEducationFormData>({
    resolver: zodResolver(skillsEducationSchema),
    defaultValues: {
      skills: formData.skills,
      education: formData.education.length > 0 ? formData.education : [
        { 
          school: '', 
          degree: '', 
          cgpa: '', 
          startMonth: '', 
          startYear: '', 
          endMonth: '', 
          endYear: '', 
          isPresent: false 
        }
      ],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education',
  });

  const watchedData = watch();

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

  const addEducation = () => {
    append({ 
      school: '', 
      degree: '', 
      cgpa: '', 
      startMonth: '', 
      startYear: '', 
      endMonth: '', 
      endYear: '', 
      isPresent: false 
    });
  };

  const togglePresent = (educationIndex: number) => {
    const currentData = watchedData.education[educationIndex];
    const newValue = !currentData?.isPresent;
    setValue(`education.${educationIndex}.isPresent`, newValue);
    
    if (newValue) {
      setValue(`education.${educationIndex}.endMonth`, '');
      setValue(`education.${educationIndex}.endYear`, '');
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

  const yearOptions = getYearOptions();

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
          <Label className="text-lg font-medium mb-4 block">
            Education *
          </Label>

          {fields.map((field, educationIndex) => (
            <Card key={field.id} className="p-6 mb-4 bg-muted/30">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  Education #{educationIndex + 1}
                </h3>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => remove(educationIndex)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor={`school-${educationIndex}`}>School/University *</Label>
                  <Input
                    id={`school-${educationIndex}`}
                    {...register(`education.${educationIndex}.school`)}
                    placeholder="University of Technology"
                    className="mt-1"
                  />
                  {errors.education?.[educationIndex]?.school && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.education[educationIndex]?.school?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`degree-${educationIndex}`}>Course/Degree *</Label>
                  <Input
                    id={`degree-${educationIndex}`}
                    {...register(`education.${educationIndex}.degree`)}
                    placeholder="Bachelor of Science in Computer Science"
                    className="mt-1"
                  />
                  {errors.education?.[educationIndex]?.degree && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.education[educationIndex]?.degree?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor={`cgpa-${educationIndex}`}>CGPA/Percentage *</Label>
                <Input
                  id={`cgpa-${educationIndex}`}
                  {...register(`education.${educationIndex}.cgpa`)}
                  placeholder="3.8/4.0 or 85%"
                  className="mt-1"
                />
                {errors.education?.[educationIndex]?.cgpa && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.education[educationIndex]?.cgpa?.message}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Start Date *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Select onValueChange={(value) => setValue(`education.${educationIndex}.startMonth`, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => setValue(`education.${educationIndex}.startYear`, value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOptions.map((year) => (
                          <SelectItem key={year.value} value={year.value}>
                            {year.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label>End Date</Label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input
                        type="checkbox"
                        checked={watchedData.education[educationIndex]?.isPresent || false}
                        onChange={() => togglePresent(educationIndex)}
                        className="rounded"
                      />
                      <span>Present</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Select 
                      disabled={watchedData.education[educationIndex]?.isPresent}
                      onValueChange={(value) => setValue(`education.${educationIndex}.endMonth`, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {MONTHS.map((month) => (
                          <SelectItem key={month.value} value={month.value}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select 
                      disabled={watchedData.education[educationIndex]?.isPresent}
                      onValueChange={(value) => setValue(`education.${educationIndex}.endYear`, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOptions.map((year) => (
                          <SelectItem key={year.value} value={year.value}>
                            {year.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addEducation}
            className="w-full border-dashed border-2 py-6 text-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Another Education
          </Button>

          {errors.education && (
            <p className="text-sm text-destructive mt-2">At least one education entry is required</p>
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
      {skills.length > 0 && fields.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center pt-4"
        >
          <p className="text-sm text-primary">
            ✓ Great! You&apos;ve added {skills.length} skill{skills.length !== 1 ? 's' : ''} and {fields.length} education entr{fields.length !== 1 ? 'ies' : 'y'}.
          </p>
        </motion.div>
      )}
    </form>
  );
}