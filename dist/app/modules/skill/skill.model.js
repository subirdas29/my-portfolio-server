"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Skill = void 0;
const mongoose_1 = require("mongoose");
const ai_service_1 = require("../ai/ai.service");
const SkillSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    logo: { type: [String], required: true },
    order: { type: Number, default: 0 },
}, { timestamps: true });
SkillSchema.post('save', async function () {
    if (process.env.NODE_ENV !== 'test') {
        try {
            const doc = this;
            await ai_service_1.AIServices.upsertSkillToAI({ _id: doc._id, title: doc.title, logo: doc.logo, order: doc.order });
        }
        catch (error) {
            console.error('Error syncing skill to Pinecone:', error);
        }
    }
});
SkillSchema.post('findOneAndUpdate', async function () {
    if (process.env.NODE_ENV !== 'test') {
        try {
            const doc = await this.model.findOne(this.getQuery());
            if (doc) {
                const d = doc;
                await ai_service_1.AIServices.upsertSkillToAI({ _id: d._id, title: d.title, logo: d.logo, order: d.order });
            }
        }
        catch (error) {
            console.error('Error updating skill in Pinecone:', error);
        }
    }
});
SkillSchema.post('findOneAndDelete', async function () {
    if (process.env.NODE_ENV !== 'test') {
        try {
            const doc = (await this.model.findOne(this.getQuery()).lean());
            if (doc && doc._id) {
                await ai_service_1.AIServices.deleteFromAI(`skill_${doc._id.toString()}`);
            }
        }
        catch (error) {
            console.error('Error deleting skill from Pinecone:', error);
        }
    }
});
exports.Skill = (0, mongoose_1.model)('Skill', SkillSchema);
//# sourceMappingURL=skill.model.js.map