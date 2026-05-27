import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { Project } from './project.model';
import { generateSlug } from '../blog/blog.utils';

const createProject = async (payload: any) => {
  const baseSlug = generateSlug(payload.title);
  const existingProject = await Project.findOne({ slug: baseSlug }).lean();
  if (existingProject) {
    payload.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
  } else {
    payload.slug = baseSlug;
  }
  const projectData = { ...payload };
  const result = await Project.create(projectData);
  return result.toObject();
};

const getAllProject = async (query: Record<string, unknown>) => {
  const projectQuery = new QueryBuilder(Project.find(), query)
    .search(['title', 'details'])
    .filter()
    .sort('order')
    .paginate()
    .fields();
  const result = await projectQuery.modelQuery.lean();
  const meta = await projectQuery.countTotal();
  return { result, meta };
};

const getSingleProject = async (slug: string) => {
  const result = await Project.findOne({ slug }).lean();
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
  }
  return result;
};

const updateProjectOrder = async (payload: { id: string; order: number }[]) => {
  const session = await Project.startSession();
  session.startTransaction();
  try {
    for (const item of payload) {
      await Project.findByIdAndUpdate(item.id, { order: item.order }, { session });
    }
    await session.commitTransaction();
    session.endSession();
    return { success: true, message: 'Order updated successfully' };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const updateProject = async (id: string, payload: any) => {
  const result = await Project.findByIdAndUpdate(id, payload, { new: true }).lean();
  return result;
};

const deleteProject = async (id: string) => {
  const result = await Project.findByIdAndDelete(id).lean();
  return result;
};

export const ProjectServices = {
  createProject,
  updateProject,
  deleteProject,
  getAllProject,
  getSingleProject,
  updateProjectOrder,
};
