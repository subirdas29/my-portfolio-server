"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillValidation = exports.updateSkillSchema = exports.skillSchema = void 0;
const zod_1 = require("zod");
exports.skillSchema = zod_1.z.object({
    title: zod_1.z.string().min(2, "Title must be at least 2 characters long"),
    logo: zod_1.z.array(zod_1.z.string().url("Invalid URL format")),
});
// Schema for updating a skill (optional fields)
exports.updateSkillSchema = exports.skillSchema.partial();
exports.SkillValidation = {
    skillSchema: exports.skillSchema,
    updateSkillSchema: exports.updateSkillSchema,
};
