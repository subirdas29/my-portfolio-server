import { z } from "zod";

// Zod schema for validating blog data
const projectSchema = z.object({
  body:z.object({
      title: z.string().min(3, "Title must be at least 3 characters long"),
      projectType: z.string().min(3, "Project type must be at least 3 characters long"),
      details: z.string().min(10, "Details must be at least 10 characters long"),
      technologies: z.string().min(2, "Technologies must be specified"),
      liveLink: z.string().url("Invalid URL format for live link"),
      githubLink: z.string().url("Invalid URL format for GitHub link"),
      imageUrls: z.array(z.string().url("Invalid URL format")).min(1, "At least one image URL is required"),
    })
  
});

const updateProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long").optional(),
  projectType: z.string().min(3, "Project type must be at least 3 characters long").optional(),
  details: z.string().min(10, "Details must be at least 10 characters long").optional(),
  technologies: z.string().min(2, "Technologies must be specified").optional(),
  liveLink: z.string().url("Invalid URL format for live link").optional(),
  githubLink: z.string().url("Invalid URL format for GitHub link").optional(),
  imageUrls: z.array(z.string().url("Invalid URL format")).min(1, "At least one image URL is required").optional(),
  });
  


export const ProjectValidation = {
    projectSchema,updateProjectSchema
  };
