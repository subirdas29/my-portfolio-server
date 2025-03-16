// import { User } from '../User/user.model';

import QueryBuilder from '../../builder/QueryBuilder';
import { TMessage } from './message.interface';
import { Message } from './message.model';

const createMessage = async (
  payload: TMessage,
  // token:JwtPayload
) => {
  //   const {email} = token
  //   const authorData = await User.isUserExist(email)

  //   if(!authorData){
  //     throw new AppError(httpStatus.NOT_FOUND,"The user is not found")
  //   }

  //   const authorBlog:Partial<TBlog> = {...payload}
  //   authorBlog.author = authorData._id

  const result = await Message.create(payload);

  return result;
};

const deleteOwnMessageByUser = async (
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

  const result = await Message.findByIdAndDelete(id);
  return result;
};

const getAllMessage = async (query: Record<string, unknown>) => {
  const MessageQuery = new QueryBuilder(Message.find(), query);

  const result = await MessageQuery.modelQuery;
  return result;
};

export const MessageServices = {
  createMessage,

  deleteOwnMessageByUser,
  getAllMessage,
};
