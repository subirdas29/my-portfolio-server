import { z } from "zod";
import { projectType } from "./project.constant";

const projectSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
 
    slug: z.string().optional(), 
    
 
    projectType: z.enum(projectType as [string, ...string[]]).default("Full-Stack"),
    
    details: z.string().min(10, "Details must be at least 10 characters long"),
    

    keyFeatures: z.string().min(2, "KeyFeatures must be specified"),
    
  
    technologies: z.array(z.string()).min(1, "At least one technology is required"),
    
    order: z.number().optional().default(0),
    
    liveLink: z.string().url("Invalid URL format for live link"),
    

    clientGithubLink: z.string().url("Invalid URL format").or(z.literal("")).optional(),
    serverGithubLink: z.string().url("Invalid URL format").or(z.literal("")).optional(),

    imageUrls: z
      .array(z.string().url("Invalid URL format"))
      .min(1, "At least one image URL is required"),
  }),
});

const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(3).optional(),
    slug: z.string().optional(),
    projectType: z.enum(projectType as [string, ...string[]]).optional(),
    details: z.string().min(10).optional(),
    keyFeatures: z.string().min(2).optional(),
    order: z.number().optional(),
    technologies: z.array(z.string()).optional(),
    liveLink: z.string().url().optional(),
    clientGithubLink: z.string().url().or(z.literal("")).optional(),
    serverGithubLink: z.string().url().or(z.literal("")).optional(),
    imageUrls: z.array(z.string().url()).optional(),
  }),
});

export const ProjectValidation = {
  projectSchema,
  updateProjectSchema,
};