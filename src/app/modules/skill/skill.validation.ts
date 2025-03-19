import { z } from "zod";

export const skillSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters long"),
  logo: z.array(z.string().url("Invalid URL format")),

});

// Schema for updating a skill (optional fields)
export const updateSkillSchema = skillSchema.partial();

export const SkillValidation = {
  skillSchema,
  updateSkillSchema,
};
