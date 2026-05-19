"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIRoutes = void 0;
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_rate_limit_2 = require("express-rate-limit");
const ai_controller_1 = require("./ai.controller");
const router = express_1.default.Router();
const chatLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    store: new express_rate_limit_2.MemoryStore(),
    message: {
        success: false,
        message: 'Too many chat requests from this IP, please try again after 15 minutes',
    },
});
router.post('/chat', chatLimiter, ai_controller_1.AIController.chat);
exports.AIRoutes = router;
