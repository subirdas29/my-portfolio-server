// import { User } from '../User/user.model';

import QueryBuilder from '../../builder/QueryBuilder';
import sendEmail from '../../utils/sendEmail';


import { TMessage } from './message.interface';
import { Message } from './message.model';

const createMessage = async (payload: TMessage) => {
 
  const result = await Message.create(payload);


  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 15px;">
      <h2 style="color: #f59e0b;">🚀 New Inquiry from Portfolio!</h2>
      <p><strong>Name:</strong> ${payload.name}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Phone:</strong> ${payload.phone}</p>
      <p><strong>Subject:</strong> ${payload.subject}</p>
      <div style="background: #f9fafb; padding: 15px; border-radius: 10px; margin-top: 10px; border-left: 4px solid #f59e0b;">
        <strong>Message:</strong><br/> ${payload.message}
      </div>
    </div>
  `;


  try {
    await sendEmail({
      subject: `New Message: ${payload.subject}`,
      html: htmlContent,
    });
  } catch (err) {
    console.error('Email sending failed:', err);
  }

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
 
  if (query?.createdAt && typeof query.createdAt === 'string') {
    const date = new Date(query.createdAt);
    
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0); 

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    query.createdAt = {
      $gte: startOfDay,
      $lte: endOfDay
    };
  }


  if (query?.range) {
    const days = query.range === 'today' ? 0 : Number(query.range);
    const startDate = new Date();
    
    if (days === 0) {
      startDate.setUTCHours(0, 0, 0, 0); 
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
