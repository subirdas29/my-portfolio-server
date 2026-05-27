import QueryBuilder from '../../builder/QueryBuilder';
import sendEmail from '../../utils/sendEmail';
import { Message } from './message.model';
import { Client } from '../client/client.model';

const createMessage = async (payload: any) => {
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
    await sendEmail({ subject: `New Message: ${payload.subject}`, html: htmlContent });
  } catch (err) {
    console.error('Email sending failed:', err);
  }
  return result.toObject();
};

const deleteOwnMessageByUser = async (id: string) => {
  const result = await Message.findByIdAndDelete(id).lean();
  return result;
};

const updateMessageStatus = async (id: string, status: string) => {
  const result = await Message.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).lean();
  if (!result) throw new Error('Message not found');
  return result;
};

const getAllMessage = async (query: any) => {
  if (query?.createdAt && typeof query.createdAt === 'string') {
    const date = new Date(query.createdAt);
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    query.createdAt = { $gte: startOfDay, $lte: endOfDay };
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
  if (query?.spam !== undefined) query.spam = query.spam === 'true';
  if (query?.priority !== undefined) query.priority = query.priority === 'true';

  const messageQuery = new QueryBuilder(Message.find(), query)
    .search(['name', 'email', 'message'])
    .filter()
    .sort()
    .paginate()
    .fields();
  // cleanup stale isConverted flags before returning
  const convertedMessages = await Message.find({ isConverted: true }).select('_id email').lean() as any[];
  if (convertedMessages.length) {
    const emails = [...new Set(convertedMessages.map((m: any) => m.email as string))];
    const activeClients = await Client.find({ email: { $in: emails } }).select('email linkedMessageId').lean() as any[];
    const activeEmails = new Set(activeClients.map((c: any) => c.email as string));
    const activeLinkedIds = new Set(activeClients.filter((c: any) => c.linkedMessageId).map((c: any) => c.linkedMessageId?.toString()));
    const staleIds = convertedMessages
      .filter((m: any) => !activeEmails.has(m.email) && !activeLinkedIds.has(m._id.toString()))
      .map((m: any) => m._id);
    if (staleIds.length) await Message.updateMany({ _id: { $in: staleIds } }, { isConverted: false });
  }

  const result = await messageQuery.modelQuery.lean();
  const meta = await messageQuery.countTotal();
  const totalBooked = await Message.countDocuments({ status: 'Booked' });
  const totalGhosted = await Message.countDocuments({ status: 'No Response' });
  return { result, meta: { ...meta, totalBooked, totalGhosted } };
};

const togglePriority = async (id: string) => {
  const msg = await Message.findById(id).lean() as any;
  if (!msg) throw new Error('Message not found');
  return Message.findByIdAndUpdate(id, { $set: { priority: !msg.priority } }, { new: true }).lean();
};

const toggleSpam = async (id: string) => {
  const msg = await Message.findById(id).lean() as any;
  if (!msg) throw new Error('Message not found');
  return Message.findByIdAndUpdate(id, { $set: { spam: !msg.spam } }, { new: true }).lean();
};

const bulkUpdateStatus = async (ids: string[], status: string) => {
  return Message.updateMany({ _id: { $in: ids } }, { $set: { status } });
};

const bulkDelete = async (ids: string[]) => {
  return Message.deleteMany({ _id: { $in: ids } });
};

const replyToMessage = async (id: string, replyHtml: string) => {
  const msg = await Message.findById(id).lean() as any;
  if (!msg) throw new Error('Message not found');
  await sendEmail({ to: msg.email, subject: `Re: ${msg.subject}`, html: replyHtml, replyTo: msg.email });
  return Message.findByIdAndUpdate(
    id,
    { $set: { status: 'Replied' }, $push: { replies: { text: replyHtml, sentAt: new Date() } } },
    { new: true },
  ).lean();
};

export const MessageServices: Record<string, (...args: any[]) => any> = {
  createMessage,
  updateMessageStatus,
  deleteOwnMessageByUser,
  getAllMessage,
  togglePriority,
  toggleSpam,
  bulkUpdateStatus,
  bulkDelete,
  replyToMessage,
};
