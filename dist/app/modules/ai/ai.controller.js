"use strict";
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
exports.AIController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const ai_service_1 = require("./ai.service");
const chatLog_model_1 = require("./chatLog.model");
const chat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message, history } = req.body;
    console.log('💬 Received chat message:', message);
    const chatHistory = Array.isArray(history)
        ? history.filter((h) => h &&
            (h.role === 'user' || h.role === 'assistant') &&
            typeof h.content === 'string')
        : [];
    const result = yield ai_service_1.AIServices.chat(message, chatHistory);
    // Log only FAILED or low-score interactions to keep DB lean
    const shouldLog = result.status === 'FAILED' || (result.score && result.score < 0.5);
    if (shouldLog) {
        yield chatLog_model_1.ChatLog.create({
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
}));
exports.AIController = {
    chat,
};
