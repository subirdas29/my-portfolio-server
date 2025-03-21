export type TProject = {
  title: string;
  projectType: "Full-Stack" | "Front-End";
  details: string;
  keyFeatures: string | string[]; 
  technologies: string | string[]; 
  liveLink: string;
  clientGithubLink: string;
  serverGithubLink?: string;
  imageUrls: string[];
  createAt: Date;
  updatedAt: Date;
};
