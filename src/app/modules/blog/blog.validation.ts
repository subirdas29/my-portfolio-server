import { z } from 'zod';


const metadataValidationSchema = z.object({
  title: z.string({ required_error: 'Meta title is required' }),
  description: z.string({ required_error: 'Meta description is required' }),
});

const blogSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    content: z.string({ required_error: 'Content is required' }),
    summary: z.string().optional(),
    featuredImage: z.string().url('Invalid image URL').optional(),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    status: z.enum(['draft', 'published']).default('draft'),
    metadata: metadataValidationSchema,
   
  }),
});

const updateBlogSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    summary: z.string().optional(),
    featuredImage: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
    categories: z.array(z.string()).optional(),
    status: z.enum(['draft', 'published']).optional(),
    metadata: metadataValidationSchema.partial().optional(), // 
  }),
});

export const BlogValidation = {
  blogSchema,
  updateBlogSchema,
};