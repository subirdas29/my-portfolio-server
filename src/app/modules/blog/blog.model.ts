import { model, Schema, Document } from 'mongoose';
import { IBlog } from './blog.interface';
import { AIServices } from '../ai/ai.service';

const blogSchema = new Schema(
  {
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
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  },
);

blogSchema.index({ slug: 1 });
blogSchema.index({ title: 'text', content: 'text' });

// Auto-sync with Pinecone on save, update, delete
blogSchema.post('save', async function () {
  if (process.env.NODE_ENV !== 'test') {
    try {
      const doc = this as Document & IBlog;
      await AIServices.upsertBlogToAI({
        _id: doc._id,
        title: doc.title,
        content: doc.content,
        summary: doc.summary,
        tags: doc.tags,
        category: doc.category,
        publishedAt: doc.publishedAt,
      });
    } catch (error) {
      console.error('Error syncing blog to Pinecone:', error);
    }
  }
});

blogSchema.post('findOneAndUpdate', async function () {
  if (process.env.NODE_ENV !== 'test') {
    try {
      const doc = await this.model.findOne(this.getQuery());
      if (doc) {
        const d = doc as Document & IBlog;
        await AIServices.upsertBlogToAI({
          _id: d._id,
          title: d.title,
          content: d.content,
          summary: d.summary,
          tags: d.tags,
          category: d.category,
          publishedAt: d.publishedAt,
        });
      }
    } catch (error) {
      console.error('Error updating blog in Pinecone:', error);
    }
  }
});

blogSchema.post('findOneAndDelete', async function () {
  if (process.env.NODE_ENV !== 'test') {
    try {
      const doc = (await this.model.findOne(this.getQuery()).lean()) as
        | (IBlog & { _id: unknown })
        | null;
      if (doc && doc._id) {
        await AIServices.deleteFromAI(`blog_${doc._id.toString()}`);
      }
    } catch (error) {
      console.error('Error deleting blog from Pinecone:', error);
    }
  }
});

export const Blog = model<IBlog>('Blog', blogSchema);
