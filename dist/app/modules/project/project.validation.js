"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectValidation = void 0;
const zod_1 = require("zod");
const project_constant_1 = require("./project.constant");
const projectSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3, "Title must be at least 3 characters long"),
        slug: zod_1.z.string().optional(),
        projectType: zod_1.z.enum(project_constant_1.projectType).default("Full-Stack"),
        details: zod_1.z.string().min(10, "Details must be at least 10 characters long"),
        keyFeatures: zod_1.z.string().min(2, "KeyFeatures must be specified"),
        technologies: zod_1.z.array(zod_1.z.string()).min(1, "At least one technology is required"),
        order: zod_1.z.number().optional().default(0),
        liveLink: zod_1.z.string().url("Invalid URL format for live link"),
        clientGithubLink: zod_1.z.string().url("Invalid URL format").or(zod_1.z.literal("")).optional(),
        serverGithubLink: zod_1.z.string().url("Invalid URL format").or(zod_1.z.literal("")).optional(),
        imageUrls: zod_1.z
            .array(zod_1.z.string().url("Invalid URL format"))
            .min(1, "At least one image URL is required"),
    }),
});
const updateProjectSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(3).optional(),
        slug: zod_1.z.string().optional(),
        projectType: zod_1.z.enum(project_constant_1.projectType).optional(),
        details: zod_1.z.string().min(10).optional(),
        keyFeatures: zod_1.z.string().min(2).optional(),
        order: zod_1.z.number().optional(),
        technologies: zod_1.z.array(zod_1.z.string()).optional(),
        liveLink: zod_1.z.string().url().optional(),
        clientGithubLink: zod_1.z.string().url().or(zod_1.z.literal("")).optional(),
        serverGithubLink: zod_1.z.string().url().or(zod_1.z.literal("")).optional(),
        imageUrls: zod_1.z.array(zod_1.z.string().url()).optional(),
    }),
});
exports.ProjectValidation = {
    projectSchema,
    updateProjectSchema,
};
