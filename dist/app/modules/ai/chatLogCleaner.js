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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanOldChatLogs = void 0;
const chatLog_model_1 = require("./chatLog.model");
const CLEANUP_OLDER_THAN_DAYS = 30;
const cleanOldChatLogs = () => __awaiter(void 0, void 0, void 0, function* () {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - CLEANUP_OLDER_THAN_DAYS);
    const result = yield chatLog_model_1.ChatLog.deleteMany({
        createdAt: { $lt: cutoffDate },
    });
    if (result.deletedCount > 0) {
        console.log(`🧹 ChatLog Cleanup: Deleted ${result.deletedCount} logs older than ${CLEANUP_OLDER_THAN_DAYS} days`);
    }
    return result.deletedCount;
});
exports.cleanOldChatLogs = cleanOldChatLogs;
