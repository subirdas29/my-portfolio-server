export type TProject = {
  title: string;
  slug: string;
  shortDescription:string;
  projectType: "Full-Stack" | "Front-End";
  details: string;
  keyFeatures: string; 
  technologies: string[]; 
  liveLink: string;
  order: number;
  clientGithubLink?: string;
  serverGithubLink?: string;
  imageUrls: string[];
  createAt: Date;
  updatedAt: Date;
};
