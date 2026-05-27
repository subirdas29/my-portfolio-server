import { Types } from 'mongoose';

export type TBlogMetadata = {
  title: string;
  description: string;
};

export type TBlog = {
  title: string;
  slug: string;
  content: string;
  summary?: string;
  featuredImage?: string;
  tags?: string[];
  category?: string;
  status: 'draft' | 'published';
  publishedAt?: Date;
  meta?: {
    views: number;
    likes: number;
  };
  metadata: TBlogMetadata;
  likedBy?: Types.ObjectId[];
};
