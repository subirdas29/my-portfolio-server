"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = require("mongoose");
const project_constant_1 = require("./project.constant");
const ai_service_1 = require("../ai/ai.service");
const ProjectSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    projectType: { type: String, enum: project_constant_1.projectType, default: 'Full-Stack' },
    shortDescription: { type: String, required: true },
    details: { type: String, required: true },
    keyFeatures: {
        type: String,
        required: true,
    },
    order: { type: Number, default: 0 },
    technologies: {
        type: [String],
        required: true,
        default: [],
    },
    tags: {
        type: [String],
        default: [],
    },
    liveLink: { type: String, required: true },
    clientGithubLink: { type: String, default: '' },
    serverGithubLink: { type: String, default: '' },
    imageUrls: { type: [String], required: true },
    videoUrl: { type: String, default: '' },
    status: {
        type: String,
        enum: ['Planning', 'In Progress', 'Completed', 'Deployed', 'Archived'],
        default: 'Deployed',
    },
    startDate: { type: Date },
    endDate: { type: Date },
    isClientProject: { type: Boolean, default: false },
    clientName: { type: String },
    clientEmail: { type: String },
}, { timestamps: true });
ProjectSchema.post('save', async function () {
    if (process.env.NODE_ENV !== 'test') {
        try {
            const doc = this;
            await ai_service_1.AIServices.upsertProjectToAI({
                _id: doc._id,
                title: doc.title,
                shortDescription: doc.shortDescription,
                details: doc.details,
                keyFeatures: doc.keyFeatures,
                technologies: doc.technologies,
                liveLink: doc.liveLink,
                projectType: doc.projectType,
                tags: doc.tags || [],
            });
        }
        catch (error) {
            console.error('Error syncing project to Pinecone:', error);
        }
    }
});
ProjectSchema.post('findOneAndUpdate', async function () {
    if (process.env.NODE_ENV !== 'test') {
        try {
            const doc = await this.model.findOne(this.getQuery());
            if (doc) {
                const d = doc;
                await ai_service_1.AIServices.upsertProjectToAI({
                    _id: d._id,
                    title: d.title,
                    shortDescription: d.shortDescription,
                    details: d.details,
                    keyFeatures: d.keyFeatures,
                    technologies: d.technologies,
                    liveLink: d.liveLink,
                    projectType: d.projectType,
                    tags: d.tags || [],
                });
            }
        }
        catch (error) {
            console.error('Error updating project in Pinecone:', error);
        }
    }
});
ProjectSchema.post('findOneAndDelete', async function () {
    if (process.env.NODE_ENV !== 'test') {
        try {
            const doc = (await this.model.findOne(this.getQuery()).lean());
            if (doc && doc._id) {
                await ai_service_1.AIServices.deleteFromAI(`project_${doc._id.toString()}`);
            }
        }
        catch (error) {
            console.error('Error deleting project from Pinecone:', error);
        }
    }
});
exports.Project = (0, mongoose_1.model)('Project', ProjectSchema);
//# sourceMappingURL=project.model.js.map