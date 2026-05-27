"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const ai_service_1 = require("./ai.service");
const chatLog_model_1 = require("./chatLog.model");
const chat = (0, catchAsync_1.default)(async (req, res) => {
    const { message, history } = req.body;
    console.log('💬 Received chat message:', message);
    const chatHistory = Array.isArray(history)
        ? history.filter((h) => h &&
            (h.role === 'user' || h.role === 'assistant') &&
            typeof h.content === 'string')
        : [];
    const result = await ai_service_1.AIServices.chat(message, chatHistory);
    const shouldLog = result.status === 'FAILED' || (result.score && result.score < 0.5);
    if (shouldLog) {
        await chatLog_model_1.ChatLog.create({
            query: message,
            response: result.message,
            score: result.score || 0,
            status: result.status || 'FAILED',
        });
    }
    res.status(200).json({
        success: result.success,
        message: result.message,
        projects: result.projects,
        skills: result.skills,
        blogs: result.blogs,
    });
});
exports.AIController = {
    chat,
};
//# sourceMappingURL=ai.controller.js.map