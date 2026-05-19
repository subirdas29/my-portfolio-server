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
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const DB_1 = __importDefault(require("./app/DB"));
const chatLogCleaner_1 = require("./app/modules/ai/chatLogCleaner");
let server;
const CHATLOG_CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.database_url);
            console.log('✅ MongoDB Connected Successfully');
            yield (0, DB_1.default)();
            server = app_1.default.listen(config_1.default.port, () => {
                console.log(`🚀 Server is running on port ${config_1.default.port}`);
            });
            // Run initial cleanup on startup
            (0, chatLogCleaner_1.cleanOldChatLogs)();
            // Schedule daily cleanup
            setInterval(() => {
                (0, chatLogCleaner_1.cleanOldChatLogs)();
            }, CHATLOG_CLEANUP_INTERVAL);
        }
        catch (err) {
            console.error('💥 Critical Startup Error:', err);
            process.exit(1);
        }
    });
}
main();
process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('😈 Uncaught Exception detected! Shutting down safely...', err);
    process.exit(1);
});
const gracefulShutdown = (signal) => __awaiter(void 0, void 0, void 0, function* () {
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
});
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
