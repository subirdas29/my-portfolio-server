"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIValidation = void 0;
const zod_1 = require("zod");
const chatValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        message: zod_1.z
            .string()
            .min(1, 'Message is required')
            .max(500, 'Message too long'),
    }),
});
exports.AIValidation = {
    chatValidationSchema,
};
