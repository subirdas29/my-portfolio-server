"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const DB_1 = __importDefault(require("./app/DB"));
const chatLogCleaner_1 = require("./app/modules/ai/chatLogCleaner");
let server;
const CHATLOG_CLEANUP_INTERVAL = 24 * 60 * 60 * 1000;
async function main() {
    try {
        await mongoose_1.default.connect(config_1.default.database_url);
        console.log('✅ MongoDB Connected Successfully');
        await (0, DB_1.default)();
        server = app_1.default.listen(config_1.default.port, () => {
            console.log(`🚀 Server is running on port ${config_1.default.port}`);
        });
        (0, chatLogCleaner_1.cleanOldChatLogs)();
        setInterval(() => {
            (0, chatLogCleaner_1.cleanOldChatLogs)();
        }, CHATLOG_CLEANUP_INTERVAL);
    }
    catch (err) {
        console.error('💥 Critical Startup Error:', err);
        process.exit(1);
    }
}
main();
process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('😈 Uncaught Exception detected! Shutting down safely...', err);
    process.exit(1);
});
const gracefulShutdown = async (signal) => {
    console.log(`\n🛑 ${signal} received. Cleaning up...`);
    if (server) {
        server.close(() => {
            mongoose_1.default.connection.close(false).then(() => {
                process.exit(0);
            });
        });
    }
    else {
        process.exit(0);
    }
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
//# sourceMappingURL=server.js.map