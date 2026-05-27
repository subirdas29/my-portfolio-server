"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose_1 = require("mongoose");
const ai_service_1 = require("../ai/ai.service");
const blogSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    content: { type: String, required: true },
    summary: String,
    featuredImage: String,
    tags: [{ type: String }],
    category: { type: String },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    publishedAt: Date,
    meta: {
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
    },
    metadata: {
        title: { type: String, required: true },
        description: { type: String, required: true },
    },
    likedBy: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });
blogSchema.index({ slug: 1 });
blogSchema.index({ title: 'text', content: 'text' });
blogSchema.post('save', async function () {
    if (process.env.NODE_ENV !== 'test') {
        try {
            const doc = this;
            await ai_service_1.AIServices.upsertBlogToAI({
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
blogSchema.post('findOneAndUpdate', async function () {
    if (process.env.NODE_ENV !== 'test') {
        try {
            const doc = await this.model.findOne(this.getQuery());
            if (doc) {
                const d = doc;
                await ai_service_1.AIServices.upsertBlogToAI({
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
blogSchema.post('findOneAndDelete', async function () {
    if (process.env.NODE_ENV !== 'test') {
        try {
            const doc = (await this.model.findOne(this.getQuery()).lean());
            if (doc && doc._id) {
                await ai_service_1.AIServices.deleteFromAI(`blog_${doc._id.toString()}`);
            }
        }
        catch (error) {
            console.error('Error deleting blog from Pinecone:', error);
        }
    }
});
exports.Blog = (0, mongoose_1.model)('Blog', blogSchema);
//# sourceMappingURL=blog.model.js.map