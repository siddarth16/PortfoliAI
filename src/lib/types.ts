export interface UserFormData {
  // Step 1: Basic Info
  name: string;
  title: string;
  bio: string;
  
  // Step 2: Work History
  workHistory: WorkExperience[];
  
  // Step 3: Projects
  projects: Project[];
  
  // Step 4: Skills & Education
  skills: string[];
  education: string;
  
  // Step 5: Media
  media: MediaFile[];
  
  // Step 6: Reference Site
  referenceSite: string;
}

export interface WorkExperience {
  position: string;
  company: string;
  duration: string;
  bullets: string[];
}

export interface Project {
  title: string;
  description: string;
  stack: string[];
  url?: string;
  github?: string;
}

export interface MediaFile {
  file: File;
  url: string;
  type: 'image' | 'video';
}

export interface GeneratedWebsite {
  html: string;
  css: string;
  js: string;
  preview: string;
}

export interface FormStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}