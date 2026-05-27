"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const sendEmail_1 = __importDefault(require("../../utils/sendEmail"));
const message_model_1 = require("./message.model");
const client_model_1 = require("../client/client.model");
const createMessage = async (payload) => {
    const result = await message_model_1.Message.create(payload);
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
        await (0, sendEmail_1.default)({ subject: `New Message: ${payload.subject}`, html: htmlContent });
    }
    catch (err) {
        console.error('Email sending failed:', err);
    }
    return result.toObject();
};
const deleteOwnMessageByUser = async (id) => {
    const result = await message_model_1.Message.findByIdAndDelete(id).lean();
    return result;
};
const updateMessageStatus = async (id, status) => {
    const result = await message_model_1.Message.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).lean();
    if (!result)
        throw new Error('Message not found');
    return result;
};
const getAllMessage = async (query) => {
    if ((query === null || query === void 0 ? void 0 : query.createdAt) && typeof query.createdAt === 'string') {
        const date = new Date(query.createdAt);
        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setUTCHours(23, 59, 59, 999);
        query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }
    if (query === null || query === void 0 ? void 0 : query.range) {
        const days = query.range === 'today' ? 0 : Number(query.range);
        const startDate = new Date();
        if (days === 0) {
            startDate.setUTCHours(0, 0, 0, 0);
        }
        else {
            startDate.setDate(startDate.getDate() - days);
            startDate.setUTCHours(0, 0, 0, 0);
        }
        query.createdAt = { $gte: startDate };
        delete query.range;
    }
    if ((query === null || query === void 0 ? void 0 : query.spam) !== undefined)
        query.spam = query.spam === 'true';
    if ((query === null || query === void 0 ? void 0 : query.priority) !== undefined)
        query.priority = query.priority === 'true';
    const messageQuery = new QueryBuilder_1.default(message_model_1.Message.find(), query)
        .search(['name', 'email', 'message'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const convertedMessages = await message_model_1.Message.find({ isConverted: true }).select('_id email').lean();
    if (convertedMessages.length) {
        const emails = [...new Set(convertedMessages.map((m) => m.email))];
        const activeClients = await client_model_1.Client.find({ email: { $in: emails } }).select('email linkedMessageId').lean();
        const activeEmails = new Set(activeClients.map((c) => c.email));
        const activeLinkedIds = new Set(activeClients.filter((c) => c.linkedMessageId).map((c) => { var _a; return (_a = c.linkedMessageId) === null || _a === void 0 ? void 0 : _a.toString(); }));
        const staleIds = convertedMessages
            .filter((m) => !activeEmails.has(m.email) && !activeLinkedIds.has(m._id.toString()))
            .map((m) => m._id);
        if (staleIds.length)
            await message_model_1.Message.updateMany({ _id: { $in: staleIds } }, { isConverted: false });
    }
    const result = await messageQuery.modelQuery.lean();
    const meta = await messageQuery.countTotal();
    const totalBooked = await message_model_1.Message.countDocuments({ status: 'Booked' });
    const totalGhosted = await message_model_1.Message.countDocuments({ status: 'No Response' });
    return { result, meta: Object.assign(Object.assign({}, meta), { totalBooked, totalGhosted }) };
};
const togglePriority = async (id) => {
    const msg = await message_model_1.Message.findById(id).lean();
    if (!msg)
        throw new Error('Message not found');
    return message_model_1.Message.findByIdAndUpdate(id, { $set: { priority: !msg.priority } }, { new: true }).lean();
};
const toggleSpam = async (id) => {
    const msg = await message_model_1.Message.findById(id).lean();
    if (!msg)
        throw new Error('Message not found');
    return message_model_1.Message.findByIdAndUpdate(id, { $set: { spam: !msg.spam } }, { new: true }).lean();
};
const bulkUpdateStatus = async (ids, status) => {
    return message_model_1.Message.updateMany({ _id: { $in: ids } }, { $set: { status } });
};
const bulkDelete = async (ids) => {
    return message_model_1.Message.deleteMany({ _id: { $in: ids } });
};
const replyToMessage = async (id, replyHtml) => {
    const msg = await message_model_1.Message.findById(id).lean();
    if (!msg)
        throw new Error('Message not found');
    await (0, sendEmail_1.default)({ to: msg.email, subject: `Re: ${msg.subject}`, html: replyHtml, replyTo: msg.email });
    return message_model_1.Message.findByIdAndUpdate(id, { $set: { status: 'Replied' }, $push: { replies: { text: replyHtml, sentAt: new Date() } } }, { new: true }).lean();
};
exports.MessageServices = {
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
//# sourceMappingURL=message.service.js.map