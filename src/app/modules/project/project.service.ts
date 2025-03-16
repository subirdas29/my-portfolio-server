// import { User } from '../User/user.model';

import QueryBuilder from '../../builder/QueryBuilder';
import { TProject } from './project.interface';
import { Project } from './project.model';

const createProject = async (
  payload: TProject,
  // token:JwtPayload
) => {
  //   const {email} = token
  //   const authorData = await User.isUserExist(email)

  //   if(!authorData){
  //     throw new AppError(httpStatus.NOT_FOUND,"The user is not found")
  //   }

  //   const authorBlog:Partial<TBlog> = {...payload}
  //   authorBlog.author = authorData._id

  const result = await Project.create(payload);

  return result;
};

const updateOwnProjectByUser = async (
  id: string,
  payload: TProject,
  // token:JwtPayload
) => {
  //   const {email} = token

  //   const user = await User.isUserExist(email)
  //   const author = await Blog.findById(id)

  //   if(!user){
  //     throw new AppError(httpStatus.NOT_FOUND,"The user is not found")
  //   }
  //   if(!(user._id.toString()===author?.author.toString())){
  //     throw new AppError(httpStatus.UNAUTHORIZED,"You can not update this blog, Because you are not author this blog")
  //   }
  const result = await Project.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteOwnProjectByUser = async (
  id: string,
  // token:JwtPayload
) => {
  //   const {email} = token
  //   const user = await User.isUserExist(email)
  //   const author = await Blog.findById(id)

  //   if(!user){
  //     throw new AppError(httpStatus.NOT_FOUND,"The user is not found")
  //   }
  //   if(!(user._id.toString()===author?.author.toString())){
  //     throw new AppError(httpStatus.UNAUTHORIZED,"You can not delete this blog, Because you are not author this blog")
  //   }

  const result = await Project.findByIdAndDelete(id);
  return result;
};

const getAllProject = async (query: Record<string, unknown>) => {
  const projectQuery = new QueryBuilder(Project.find(), query);

  const result = await projectQuery.modelQuery;
  return result;
};

export const ProjectServices = {
  createProject,
  updateOwnProjectByUser,
  deleteOwnProjectByUser,
  getAllProject,
};
