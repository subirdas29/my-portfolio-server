import { model, Schema } from "mongoose";
import { IBlog } from "./blog.interface";




const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
 
  content: {
    type: String,
    required: true
  },
  summary: String,
  featuredImage: String, 
  tags: [{ type: String }],
  category: { type: String },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  publishedAt: Date,
  meta: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 }
  },
  metadata: {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  likedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, {
  timestamps: true,
});


blogSchema.index({ slug: 1 });
blogSchema.index({ title: 'text', content: 'text' });

export const Blog = model<IBlog>('Blog', blogSchema);