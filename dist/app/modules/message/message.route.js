"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRoutes = void 0;
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importStar(require("express-rate-limit"));
const message_controller_1 = require("./message.controller");
const router = express_1.default.Router();
const contactLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false,
    store: new express_rate_limit_1.MemoryStore(),
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
//# sourceMappingURL=message.route.js.map