import { z } from 'zod';

const chatValidationSchema = z.object({
  body: z.object({
    message: z
      .string()
      .min(1, 'Message is required')
      .max(500, 'Message too long'),
  }),
});

export const AIValidation = {
  chatValidationSchema,
};
