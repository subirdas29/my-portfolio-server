"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
}, { timestamps: true });
ProjectSchema.post('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV !== 'test') {
            try {
                const doc = this;
                yield ai_service_1.AIServices.upsertProjectToAI({
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
});
ProjectSchema.post('findOneAndUpdate', function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV !== 'test') {
            try {
                const doc = yield this.model.findOne(this.getQuery());
                if (doc) {
                    const d = doc;
                    yield ai_service_1.AIServices.upsertProjectToAI({
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
});
ProjectSchema.post('findOneAndDelete', function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV !== 'test') {
            try {
                const doc = (yield this.model.findOne(this.getQuery()).lean());
                if (doc && doc._id) {
                    yield ai_service_1.AIServices.deleteFromAI(`project_${doc._id.toString()}`);
                }
            }
            catch (error) {
                console.error('Error deleting project from Pinecone:', error);
            }
        }
    });
});
exports.Project = (0, mongoose_1.model)('Project', ProjectSchema);
