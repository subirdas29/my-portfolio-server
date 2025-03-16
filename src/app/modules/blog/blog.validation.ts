import { z } from "zod";

// Zod schema for validating blog data
const blogSchema = z.object({
  body:z.object({
    title: z
    .string({
      required_error: "Title is required",
    }),
   
  content: z
    .string({
      required_error: "Content is required",
    }),
  })
});

const updateBlogSchema = z.object({
    body:z.object({
      title: z
      .string({
        required_error: "Title is required",
      }).optional(),
      
    content: z
      .string({
        required_error: "Content is required",
      }).optional(),
    })
  });
  


export const BlogValidation = {
    blogSchema,updateBlogSchema
  };
