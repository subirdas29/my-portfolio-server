import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { Blog } from './blog.model';
import { generateSlug } from './blog.utils';

const createBlog = async (payload: any) => {
  const baseSlug = generateSlug(payload.title);
  const existingBlog = await Blog.findOne({ slug: baseSlug }).lean();
  if (existingBlog) {
    payload.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
  } else {
    payload.slug = baseSlug;
  }
  const result = await Blog.create(payload);
  return result.toObject();
};

const getSingleBlog = async (slug: string) => {
  const result = await Blog.findOneAndUpdate(
    { slug },
    { $inc: { 'meta.views': 1 } },
    { new: true },
  ).lean();
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blog not found');
  }
  return result;
};

const updateOwnBlogByUser = async (id: string, payload: any) => {
  const result = await Blog.findByIdAndUpdate(id, payload, { new: true }).lean();
  return result;
};

const deleteOwnBlogByUser = async (id: string) => {
  const result = await Blog.findByIdAndDelete(id).lean();
  return result;
};

const getAllBlog = async (query: Record<string, unknown>) => {
  const blogQuery = new QueryBuilder(Blog.find(), query)
    .search(['title', 'content'])
    .filter()
    .sort('-createdAt')
    .paginate()
    .fields();
  const result = await blogQuery.modelQuery.lean();
  const meta = await blogQuery.countTotal();
  return { result, meta };
};

const getBlogAnalytics = async () => {
  const allBlogs = await Blog.find().lean() as any[];
  const published = allBlogs.filter((b) => b.status === 'published');
  const draft = allBlogs.filter((b) => b.status !== 'published');
  const topByViews = [...allBlogs].sort((a, b) => ((b.meta && b.meta.views) || 0) - ((a.meta && a.meta.views) || 0)).slice(0, 5);
  const topByLikes = [...allBlogs].sort((a, b) => ((b.meta && b.meta.likes) || 0) - ((a.meta && a.meta.likes) || 0)).slice(0, 5);
  const recentActivity = [...allBlogs].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);
  const totalViews = allBlogs.reduce((sum, b) => sum + ((b.meta && b.meta.views) || 0), 0);
  const totalLikes = allBlogs.reduce((sum, b) => sum + ((b.meta && b.meta.likes) || 0), 0);
  return {
    topByViews,
    topByLikes,
    publishedVsDraft: { published: published.length, draft: draft.length },
    recentActivity,
    summary: {
      total: allBlogs.length,
      published: published.length,
      draft: draft.length,
      totalViews,
      totalLikes,
    },
  };
};

export const BlogServices = {
  createBlog,
  updateOwnBlogByUser,
  deleteOwnBlogByUser,
  getAllBlog,
  getSingleBlog,
  getBlogAnalytics,
};
