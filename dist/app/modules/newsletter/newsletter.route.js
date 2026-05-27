"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const newsletter_controller_1 = require("./newsletter.controller");

const router = express_1.default.Router();

router.post('/subscribe', newsletter_controller_1.NewsletterController.subscribeController);
router.post('/unsubscribe', newsletter_controller_1.NewsletterController.unsubscribeController);
router.get('/', newsletter_controller_1.NewsletterController.getAllSubscribersController);

exports.NewsletterRoutes = router;
