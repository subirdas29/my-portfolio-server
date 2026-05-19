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
exports.Blog = void 0;
const mongoose_1 = require("mongoose");
const ai_service_1 = require("../ai/ai.service");
const blogSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    content: {
        type: String,
        required: true,
    },
    summary: String,
    featuredImage: String,
    tags: [{ type: String }],
    category: { type: String },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft',
    },
    publishedAt: Date,
    meta: {
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
    },
    metadata: {
        title: { type: String, required: true },
        description: { type: String, required: true },
    },
    likedBy: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
}, {
    timestamps: true,
});
blogSchema.index({ slug: 1 });
blogSchema.index({ title: 'text', content: 'text' });
// Auto-sync with Pinecone on save, update, delete
blogSchema.post('save', function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV !== 'test') {
            try {
                const doc = this;
                yield ai_service_1.AIServices.upsertBlogToAI({
                    _id: doc._id,
                    title: doc.title,
                    content: doc.content,
                    summary: doc.summary,
                    tags: doc.tags,
                    category: doc.category,
                    publishedAt: doc.publishedAt,
                });
            }
            catch (error) {
                console.error('Error syncing blog to Pinecone:', error);
            }
        }
    });
});
blogSchema.post('findOneAndUpdate', function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV !== 'test') {
            try {
                const doc = yield this.model.findOne(this.getQuery());
                if (doc) {
                    const d = doc;
                    yield ai_service_1.AIServices.upsertBlogToAI({
                        _id: d._id,
                        title: d.title,
                        content: d.content,
                        summary: d.summary,
                        tags: d.tags,
                        category: d.category,
                        publishedAt: d.publishedAt,
                    });
                }
            }
            catch (error) {
                console.error('Error updating blog in Pinecone:', error);
            }
        }
    });
});
blogSchema.post('findOneAndDelete', function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV !== 'test') {
            try {
                const doc = (yield this.model.findOne(this.getQuery()).lean());
                if (doc && doc._id) {
                    yield ai_service_1.AIServices.deleteFromAI(`blog_${doc._id.toString()}`);
                }
            }
            catch (error) {
                console.error('Error deleting blog from Pinecone:', error);
            }
        }
    });
});
exports.Blog = (0, mongoose_1.model)('Blog', blogSchema);
