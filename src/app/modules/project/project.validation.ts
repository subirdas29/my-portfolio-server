import { z } from "zod";

// Zod schema for validating project data
const projectSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    projectType: z.string().min(3, "Project type must be at least 3 characters long"),
    details: z.string().min(10, "Details must be at least 10 characters long"),

    keyFeatures: z
  .union([
    z.string().min(2, "KeyFeatures must be specified"), 
    z.array(z.string().min(1))
  ]),
    technologies: z.union([
      z.string().min(2, "Technologies must be specified"), 
      z.array(z.string().min(1)).nonempty("At least one technology is required"),
    ]),

    liveLink: z.string().url("Invalid URL format for live link"),
    clientGithubLink: z.string().url("Invalid URL format for client link"),
    
 
    serverGithubLink: z.union([
      z.string().url("Invalid URL format for server link"),
      z.literal(""),
      z.null(), 
    ]).optional(),

    imageUrls: z
      .array(z.string().url("Invalid URL format"))
      .min(1, "At least one image URL is required"),
  }),
});

// Zod schema for updating a project (optional fields)
const updateProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long").optional(),
  projectType: z.string().min(3, "Project type must be at least 3 characters long").optional(),
  details: z.string().min(10, "Details must be at least 10 characters long").optional(),

  keyFeatures: z
  .union([
    z.string().min(2, "KeyFeatures must be specified"), // Allow string input
    z.array(z.string().min(1)).optional(), // Allow array input
  ])
  .optional(),
  technologies: z
    .union([
      z.string().min(2, "Technologies must be specified"), // Allow string input
      z.array(z.string().min(1)).optional(), // Allow array input
    ])
    .optional(),

  liveLink: z.string().url("Invalid URL format for live link").optional(),
  clientGithubLink: z.string().url("Invalid URL format for GitHub link").optional(),

  // ✅ Allow empty, null, or missing `serverGithubLink`
  serverGithubLink: z.union([
    z.string().url("Invalid URL format for server link"),
    z.literal(""), // Allow empty string
    z.null(), // Allow null
  ]).optional(),

  imageUrls: z
    .array(z.string().url("Invalid URL format"))
    .min(1, "At least one image URL is required")
    .optional(),
});

export const ProjectValidation = {
  projectSchema,
  updateProjectSchema,
};
