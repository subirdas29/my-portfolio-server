"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanOldChatLogs = void 0;
const chatLog_model_1 = require("./chatLog.model");
const CLEANUP_OLDER_THAN_DAYS = 30;
const cleanOldChatLogs = async () => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - CLEANUP_OLDER_THAN_DAYS);
    const result = await chatLog_model_1.ChatLog.deleteMany({
        createdAt: { $lt: cutoffDate },
    });
    if (result.deletedCount > 0) {
        console.log(`🧹 ChatLog Cleanup: Deleted ${result.deletedCount} logs older than ${CLEANUP_OLDER_THAN_DAYS} days`);
    }
    return result.deletedCount;
};
exports.cleanOldChatLogs = cleanOldChatLogs;
//# sourceMappingURL=chatLogCleaner.js.map