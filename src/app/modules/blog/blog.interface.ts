import { Types } from 'mongoose';

export interface IBlog {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  featuredImage?: string;
  tags?: string[];
  category?: string;
  status: 'draft' | 'published';
  publishedAt?: Date;
  meta: {
    views: number;
    likes: number;
  };
  metadata: {
    title: string;
    description: string;
  };
  likedBy: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}