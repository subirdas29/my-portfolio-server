"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogValidation = void 0;
const zod_1 = require("zod");
const metadataValidationSchema = zod_1.z.object({
    title: zod_1.z.string({ required_error: 'Meta title is required' }),
    description: zod_1.z.string({ required_error: 'Meta description is required' }),
});
const blogSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string({ required_error: 'Title is required' }),
        content: zod_1.z.string({ required_error: 'Content is required' }),
        summary: zod_1.z.string().optional(),
        featuredImage: zod_1.z.string().url('Invalid image URL').optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        category: zod_1.z.string().optional(),
        status: zod_1.z.enum(['draft', 'published']).default('draft'),
        metadata: metadataValidationSchema,
    }),
});
const updateBlogSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().optional(),
        content: zod_1.z.string().optional(),
        summary: zod_1.z.string().optional(),
        featuredImage: zod_1.z.string().url().optional(),
        tags: zod_1.z.array(zod_1.z.string()).optional(),
        category: zod_1.z.string().optional(),
        status: zod_1.z.enum(['draft', 'published']).optional(),
        metadata: metadataValidationSchema.partial().optional(),
    }),
});
exports.BlogValidation = {
    blogSchema,
    updateBlogSchema,
};
//# sourceMappingURL=blog.validation.js.map