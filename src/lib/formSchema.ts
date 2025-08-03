import { z } from 'zod';

// Step 1: Basic Info
export const basicInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  bio: z.string().min(10, 'Bio must be at least 10 characters').max(500, 'Bio must be less than 500 characters'),
});

// Step 2: Work History
export const workExperienceSchema = z.object({
  position: z.string().min(2, 'Position is required'),
  company: z.string().min(2, 'Company is required'),
  duration: z.string().min(2, 'Duration is required'),
  bullets: z.array(z.string().min(1, 'Bullet point cannot be empty')).min(1, 'At least one bullet point is required'),
});

export const workHistorySchema = z.object({
  workHistory: z.array(workExperienceSchema).min(1, 'At least one work experience is required'),
});

// Step 3: Projects
export const projectSchema = z.object({
  title: z.string().min(2, 'Project title is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  stack: z.array(z.string().min(1, 'Technology cannot be empty')).min(1, 'At least one technology is required'),
  url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  github: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

export const projectsSchema = z.object({
  projects: z.array(projectSchema).min(1, 'At least one project is required'),
});

// Step 4: Skills & Education
export const skillsEducationSchema = z.object({
  skills: z.array(z.string().min(1, 'Skill cannot be empty')).min(1, 'At least one skill is required'),
  education: z.string().min(2, 'Education information is required'),
});

// Step 5: Media (optional)
export const mediaSchema = z.object({
  media: z.array(z.any()).optional(),
});

// Step 6: Reference Site
export const referenceSiteSchema = z.object({
  referenceSite: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

// Combined schema for all steps
export const completeFormSchema = basicInfoSchema
  .merge(workHistorySchema)
  .merge(projectsSchema)
  .merge(skillsEducationSchema)
  .merge(mediaSchema)
  .merge(referenceSiteSchema);

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type WorkHistoryFormData = z.infer<typeof workHistorySchema>;
export type ProjectsFormData = z.infer<typeof projectsSchema>;
export type SkillsEducationFormData = z.infer<typeof skillsEducationSchema>;
export type MediaFormData = z.infer<typeof mediaSchema>;
export type ReferenceSiteFormData = z.infer<typeof referenceSiteSchema>;
export type CompleteFormData = z.infer<typeof completeFormSchema>;