export type TProject = {
  title: string;
  slug: string;
  shortDescription: string;
  projectType: 'Full-Stack' | 'Front-End';
  details: string;
  keyFeatures: string;
  technologies: string[];
  tags?: string[];
  liveLink: string;
  order: number;
  clientGithubLink?: string;
  serverGithubLink?: string;
  imageUrls: string[];
  videoUrl?: string;
  // project status tracking
  status?: 'Planning' | 'In Progress' | 'Completed' | 'Deployed' | 'Archived';
  startDate?: Date;
  endDate?: Date;
  isClientProject?: boolean;
  clientName?: string;
  clientEmail?: string;
  createAt: Date;
  updatedAt: Date;
};
