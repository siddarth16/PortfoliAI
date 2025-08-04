'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { workHistorySchema, WorkHistoryFormData } from '@/lib/formSchema';
import { UserFormData } from '@/lib/types';
import { MONTHS, getYearOptions } from '@/lib/dateConstants';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WorkHistoryStepProps {
  formData: UserFormData;
  updateFormData: (data: Partial<UserFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function WorkHistoryStep({ formData, updateFormData, onNext, onPrevious }: WorkHistoryStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
    setValue,
    watch,
  } = useForm<WorkHistoryFormData>({
    resolver: zodResolver(workHistorySchema),
    defaultValues: {
      workHistory: formData.workHistory.length > 0 ? formData.workHistory : [
        { position: '', company: '', startMonth: '', startYear: '', endMonth: '', endYear: '', isPresent: false, bullets: [''] }
      ],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'workHistory',
  });

  const onSubmit = (data: WorkHistoryFormData) => {
    updateFormData(data);
    onNext();
  };

  const addWorkExperience = () => {
    append({ position: '', company: '', startMonth: '', startYear: '', endMonth: '', endYear: '', isPresent: false, bullets: [''] });
  };

  const addBulletPoint = (experienceIndex: number) => {
    const currentFields = fields[experienceIndex];
    const newBullets = [...(currentFields.bullets || []), ''];
    setValue(`workHistory.${experienceIndex}.bullets`, newBullets);
  };

  const removeBulletPoint = (experienceIndex: number, bulletIndex: number) => {
    const currentFields = fields[experienceIndex];
    const currentBullets = currentFields.bullets || [];
    
    if (currentBullets.length > 1) {
      const newBullets = currentBullets.filter((_, index) => index !== bulletIndex);
      setValue(`workHistory.${experienceIndex}.bullets`, newBullets);
    }
  };

  const togglePresent = (experienceIndex: number) => {
    const watchedData = watch();
    const currentData = watchedData.workHistory[experienceIndex];
    const newValue = !currentData?.isPresent;
    setValue(`workHistory.${experienceIndex}.isPresent`, newValue);
    
    if (newValue) {
      setValue(`workHistory.${experienceIndex}.endMonth`, '');
      setValue(`workHistory.${experienceIndex}.endYear`, '');
    }
  };

  const watchedData = watch();
  const yearOptions = getYearOptions();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {fields.map((field, experienceIndex) => (
          <Card key={field.id} className="p-6 bg-muted/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Experience #{experienceIndex + 1}
              </h3>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(experienceIndex)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor={`position-${experienceIndex}`}>Position *</Label>
                <Input
                  id={`position-${experienceIndex}`}
                  {...register(`workHistory.${experienceIndex}.position`)}
                  placeholder="Senior Software Engineer"
                  className="mt-1"
                />
                {errors.workHistory?.[experienceIndex]?.position && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.workHistory[experienceIndex]?.position?.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor={`company-${experienceIndex}`}>Company *</Label>
                <Input
                  id={`company-${experienceIndex}`}
                  {...register(`workHistory.${experienceIndex}.company`)}
                  placeholder="Tech Corp Inc."
                  className="mt-1"
                />
                {errors.workHistory?.[experienceIndex]?.company && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.workHistory[experienceIndex]?.company?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Start Date *</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Select onValueChange={(value) => setValue(`workHistory.${experienceIndex}.startMonth`, value)}>
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
                  <Select onValueChange={(value) => setValue(`workHistory.${experienceIndex}.startYear`, value)}>
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
                {errors.workHistory?.[experienceIndex]?.startMonth && (
                  <p className="text-sm text-destructive mt-1">Start month is required</p>
                )}
                {errors.workHistory?.[experienceIndex]?.startYear && (
                  <p className="text-sm text-destructive mt-1">Start year is required</p>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label>End Date</Label>
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      checked={watchedData.workHistory[experienceIndex]?.isPresent || false}
                      onChange={() => togglePresent(experienceIndex)}
                      className="rounded"
                    />
                    <span>Present</span>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Select 
                    disabled={watchedData.workHistory[experienceIndex]?.isPresent}
                    onValueChange={(value) => setValue(`workHistory.${experienceIndex}.endMonth`, value)}
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
                    disabled={watchedData.workHistory[experienceIndex]?.isPresent}
                    onValueChange={(value) => setValue(`workHistory.${experienceIndex}.endYear`, value)}
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

            <div>
              <Label>Key Achievements & Responsibilities *</Label>
              <div className="space-y-2 mt-2">
                {field.bullets?.map((_, bulletIndex) => (
                  <div key={bulletIndex} className="flex gap-2">
                    <Textarea
                      {...register(`workHistory.${experienceIndex}.bullets.${bulletIndex}`)}
                      placeholder={`• ${bulletIndex === 0 ? 'Led a team of 5 developers to deliver...' : 'Improved system performance by...'}`}
                      className="flex-1 min-h-[80px]"
                    />
                    {field.bullets && field.bullets.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeBulletPoint(experienceIndex, bulletIndex)}
                        className="self-start mt-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addBulletPoint(experienceIndex)}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Achievement
              </Button>
              {errors.workHistory?.[experienceIndex]?.bullets && (
                <p className="text-sm text-destructive mt-1">
                  At least one bullet point is required
                </p>
              )}
            </div>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addWorkExperience}
          className="w-full border-dashed border-2 py-6 text-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Another Experience
        </Button>
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
          disabled={!isValid}
          className="px-8 py-3 text-lg glow-sm group"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
    </form>
  );
}