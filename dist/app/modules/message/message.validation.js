"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageValidation = void 0;
const zod_1 = require("zod");
// Zod schema for validating blog data
const MessageSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(3, 'Name must be at least 3 characters long'),
        email: zod_1.z.string().email('Invalid email format'),
        message: zod_1.z.string().min(5, 'Message must be at least 5 characters long'),
    }),
});
exports.MessageValidation = {
    MessageSchema,
};
