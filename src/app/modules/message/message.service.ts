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

const updateMessageStatus = async (id: string, status: string) => {
  const result = await Message.findByIdAndUpdate(
    id,
    { status }, 
    {
      new: true, 
      runValidators: true,
    },
  );

  if (!result) {
    throw new Error('Message not found');
  }

  return result;
};

const getAllMessage = async (query: Record<string, unknown>) => {
  // ১. ক্যালেন্ডার ডেট ফিল্টার ফিক্স (Specific Date)
  if (query?.createdAt && typeof query.createdAt === 'string') {
    const date = new Date(query.createdAt);
    
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0); // ওই দিনের একদম শুরু

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999); // ওই দিনের একদম শেষ

    query.createdAt = {
      $gte: startOfDay,
      $lte: endOfDay
    };
  }

  // ২. টাইমলাইন রেঞ্জ ফিল্টার ফিক্স (Range)
  if (query?.range) {
    const days = query.range === 'today' ? 0 : Number(query.range);
    const startDate = new Date();
    
    if (days === 0) {
      startDate.setUTCHours(0, 0, 0, 0); // আজকের শুরু থেকে
    } else {
      startDate.setDate(startDate.getDate() - days);
      startDate.setUTCHours(0, 0, 0, 0);
    }
    
    query.createdAt = { $gte: startDate };
    delete query.range;
  }

  // ৩. QueryBuilder কল করা
  const messageQuery = new QueryBuilder(Message.find(), query)
    .search(['name', 'email', 'message'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await messageQuery.modelQuery;
  const meta = await messageQuery.countTotal();

  const totalBooked = await Message.countDocuments({ status: 'Booked' });
  const totalGhosted = await Message.countDocuments({ status: 'No Response' });

  return {
    result,
    meta: {
      ...meta,
      totalBooked,
      totalGhosted
    },
  };
};

export const MessageServices = {
  createMessage,
updateMessageStatus,
  deleteOwnMessageByUser,
  getAllMessage,
};
