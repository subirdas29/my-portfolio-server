// import { User } from '../User/user.model';

import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { TProject } from './project.interface';
import { Project } from './project.model';
import { generateSlug } from '../blog/blog.utils';

const createProject = async (payload: TProject) => {
 
  const baseSlug = generateSlug(payload.title);

 
  const existingProject = await Project.findOne({ slug: baseSlug });

  if (existingProject) {
  
    payload.slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;
  } else {
    payload.slug = baseSlug;
  }


  const projectData: TProject = {
    ...payload,
  
  };

  const result = await Project.create(projectData);
  return result;
};

const getAllProject = async (query: Record<string, unknown>) => {
  const projectQuery = new QueryBuilder(Project.find(), query).search(['title', 'details']) 
    .filter()
    .sort('order')
    .paginate()  
    .fields();

  const result = await projectQuery.modelQuery;
    const meta = await projectQuery.countTotal();
    
    return {
        result,
        meta
    }
  }

  const getSingleProject = async (projectId: string) => {
    const result = await Project.findById(projectId)
  
    if (!result) {
       throw new AppError(httpStatus.NOT_FOUND, 'Project not found');
    }
    return result
   
  };
  

  const updateProjectOrder = async (payload: { id: string; order: number }[]) => {
    const session = await Project.startSession();
    session.startTransaction();
  
    try {
      for (const item of payload) {
        await Project.findByIdAndUpdate(
          item.id,
          { order: item.order },
          { session }
        );
      }
  
      await session.commitTransaction();
      session.endSession();
      return { success: true, message: "Order updated successfully" };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  };
  
  

const updateProject = async (
  id: string,
  payload: Partial<TProject>,
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

const deleteProject = async (
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



export const ProjectServices = {
  createProject,
  updateProject,
  deleteProject,
  getAllProject,
  getSingleProject,
  updateProjectOrder
};
