import { z } from "zod";

// Zod schema for validating blog data
const MessageSchema = z.object({
  body:z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email format"),
  message: z.string().min(5, "Message must be at least 5 characters long"),

    })
  
});




export const MessageValidation = {
    MessageSchema
  };
