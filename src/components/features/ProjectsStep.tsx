'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Plus, Trash2, ExternalLink, Github } from 'lucide-react';
import { projectsSchema, ProjectsFormData } from '@/lib/formSchema';
import { UserFormData } from '@/lib/types';

interface ProjectsStepProps {
  formData: UserFormData;
  updateFormData: (data: Partial<UserFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function ProjectsStep({ formData, updateFormData, onNext, onPrevious }: ProjectsStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<ProjectsFormData>({
    resolver: zodResolver(projectsSchema),
    defaultValues: {
      projects: formData.projects.length > 0 ? formData.projects : [],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects',
  });

  const onSubmit = (data: ProjectsFormData) => {
    // Filter out empty stack items
    const cleanedData = {
      projects: data.projects.map(project => ({
        ...project,
        stack: project.stack.filter(tech => tech.trim() !== '')
      }))
    };
    updateFormData(cleanedData);
    onNext();
  };

  const addProject = () => {
    append({ title: '', description: '', stack: [''], url: '', github: '' });
  };

  const addTechStack = (projectIndex: number) => {
    const currentFields = fields[projectIndex];
    const newStack = [...(currentFields.stack || []), ''];
    setValue(`projects.${projectIndex}.stack`, newStack);
  };

  const removeTechStack = (projectIndex: number, stackIndex: number) => {
    const currentFields = fields[projectIndex];
    const currentStack = currentFields.stack || [];
    
    if (currentStack.length > 1) {
      const newStack = currentStack.filter((_, index) => index !== stackIndex);
      setValue(`projects.${projectIndex}.stack`, newStack);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {fields.map((field, projectIndex) => (
          <Card key={field.id} className="p-6 bg-muted/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                Project #{projectIndex + 1}
              </h3>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => remove(projectIndex)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor={`title-${projectIndex}`}>Project Title *</Label>
                <Input
                  id={`title-${projectIndex}`}
                  {...register(`projects.${projectIndex}.title`)}
                  placeholder="E-commerce Platform"
                  className="mt-1"
                />
                {errors.projects?.[projectIndex]?.title && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.projects[projectIndex]?.title?.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor={`description-${projectIndex}`}>Description *</Label>
                <Textarea
                  id={`description-${projectIndex}`}
                  {...register(`projects.${projectIndex}.description`)}
                  placeholder="A full-stack e-commerce solution with user authentication, payment processing, and inventory management..."
                  className="mt-1 min-h-[100px]"
                />
                {errors.projects?.[projectIndex]?.description && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.projects[projectIndex]?.description?.message}
                  </p>
                )}
              </div>

              <div>
                <Label>Technology Stack *</Label>
                <div className="space-y-2 mt-2">
                  {field.stack?.map((_, stackIndex) => (
                    <div key={stackIndex} className="flex gap-2">
                      <Input
                        {...register(`projects.${projectIndex}.stack.${stackIndex}`)}
                        placeholder={stackIndex === 0 ? "React" : "Node.js"}
                        className="flex-1"
                      />
                      {field.stack && field.stack.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeTechStack(projectIndex, stackIndex)}
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
                  onClick={() => addTechStack(projectIndex)}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Technology
                </Button>
                {errors.projects?.[projectIndex]?.stack && (
                  <p className="text-sm text-destructive mt-1">
                    At least one technology is required
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`url-${projectIndex}`}>
                    <ExternalLink className="inline h-4 w-4 mr-1" />
                    Live Demo URL
                  </Label>
                  <Input
                    id={`url-${projectIndex}`}
                    {...register(`projects.${projectIndex}.url`)}
                    placeholder="https://myproject.com"
                    className="mt-1"
                  />
                  {errors.projects?.[projectIndex]?.url && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.projects[projectIndex]?.url?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor={`github-${projectIndex}`}>
                    <Github className="inline h-4 w-4 mr-1" />
                    GitHub Repository
                  </Label>
                  <Input
                    id={`github-${projectIndex}`}
                    {...register(`projects.${projectIndex}.github`)}
                    placeholder="https://github.com/username/project"
                    className="mt-1"
                  />
                  {errors.projects?.[projectIndex]?.github && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.projects[projectIndex]?.github?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addProject}
          className="w-full border-dashed border-2 py-6 text-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          {fields.length === 0 ? 'Add Your First Project' : 'Add Another Project'}
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
          className="px-8 py-3 text-lg glow-sm group"
        >
          Continue
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>
    </form>
  );
}