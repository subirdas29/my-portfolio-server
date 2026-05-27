"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_rate_limit_2 = require("express-rate-limit");
const message_controller_1 = require("./message.controller");
const router = express_1.default.Router();
const contactLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // ১ ঘণ্টা
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    store: new express_rate_limit_2.MemoryStore(),
    message: {
        success: false,
        message: 'You have reached the message limit (50 per hour). Please try again later.',
    },
});
router.post('/', contactLimiter, message_controller_1.MessageController.createMessageController);
router.get('/', message_controller_1.MessageController.getAllMessageController);
router.patch('/bulk/status', message_controller_1.MessageController.bulkUpdateStatusController);
router.delete('/bulk/delete', message_controller_1.MessageController.bulkDeleteController);
router.patch('/:id/status', message_controller_1.MessageController.updateMessageStatusController);
router.patch('/:id/priority', message_controller_1.MessageController.togglePriorityController);
router.patch('/:id/spam', message_controller_1.MessageController.toggleSpamController);
router.post('/:id/reply', message_controller_1.MessageController.replyToMessageController);
router.delete('/:id', message_controller_1.MessageController.deleteOwnMessageController);
exports.MessageRoutes = router;
