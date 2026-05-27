"use strict";
// import { User } from '../User/user.model';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const sendEmail_1 = __importDefault(require("../../utils/sendEmail"));
const message_model_1 = require("./message.model");
const createMessage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield message_model_1.Message.create(payload);
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
        yield (0, sendEmail_1.default)({
            subject: `New Message: ${payload.subject}`,
            html: htmlContent,
        });
    }
    catch (err) {
        console.error('Email sending failed:', err);
    }
    return result.toObject();
});
const deleteOwnMessageByUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //   const {email} = token
    //   const user = await User.isUserExist(email)
    //   const author = await Blog.findById(id)
    //   if(!user){
    //     throw new AppError(httpStatus.NOT_FOUND,"The user is not found")
    //   }
    //   if(!(user._id.toString()===author?.author.toString())){
    //     throw new AppError(httpStatus.UNAUTHORIZED,"You can not delete this blog, Because you are not author this blog")
    //   }
    const result = yield message_model_1.Message.findByIdAndDelete(id).lean();
    return result;
});
const updateMessageStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield message_model_1.Message.findByIdAndUpdate(id, { status }, {
        new: true,
        runValidators: true,
    }).lean();
    if (!result) {
        throw new Error('Message not found');
    }
    return result;
});
const getAllMessage = (query) => __awaiter(void 0, void 0, void 0, function* () {
    if ((query === null || query === void 0 ? void 0 : query.createdAt) && typeof query.createdAt === 'string') {
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
    if ((query === null || query === void 0 ? void 0 : query.spam) !== undefined) {
        query.spam = query.spam === 'true';
    }
    if ((query === null || query === void 0 ? void 0 : query.priority) !== undefined) {
        query.priority = query.priority === 'true';
    }
    const messageQuery = new QueryBuilder_1.default(message_model_1.Message.find(), query)
        .search(['name', 'email', 'message'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield messageQuery.modelQuery.lean();
    const meta = yield messageQuery.countTotal();
    const totalBooked = yield message_model_1.Message.countDocuments({ status: 'Booked' });
    const totalGhosted = yield message_model_1.Message.countDocuments({ status: 'No Response' });
    return {
        result,
        meta: Object.assign(Object.assign({}, meta), { totalBooked,
            totalGhosted }),
    };
});
const togglePriority = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = yield message_model_1.Message.findById(id).lean();
    if (!msg) throw new Error('Message not found');
    const result = yield message_model_1.Message.findByIdAndUpdate(id, { $set: { priority: !msg.priority } }, { new: true }).lean();
    return result;
});
const toggleSpam = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = yield message_model_1.Message.findById(id).lean();
    if (!msg) throw new Error('Message not found');
    const result = yield message_model_1.Message.findByIdAndUpdate(id, { $set: { spam: !msg.spam } }, { new: true }).lean();
    return result;
});
const bulkUpdateStatus = (ids, status) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield message_model_1.Message.updateMany({ _id: { $in: ids } }, { $set: { status } });
    return result;
});
const bulkDelete = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield message_model_1.Message.deleteMany({ _id: { $in: ids } });
    return result;
});
const replyToMessage = (id, replyHtml) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = yield message_model_1.Message.findById(id).lean();
    if (!msg) throw new Error('Message not found');
    yield (0, sendEmail_1.default)({
        to: msg.email,
        subject: `Re: ${msg.subject}`,
        html: replyHtml,
    });
    const result = yield message_model_1.Message.findByIdAndUpdate(id, { $set: { status: 'Replied' } }, { new: true }).lean();
    return result;
});
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
