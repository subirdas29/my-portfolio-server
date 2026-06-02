"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterRoutes = void 0;
const express_1 = require("express");
const newsletter_controller_1 = require("./newsletter.controller");
const router = (0, express_1.Router)();
router.post('/subscribe', newsletter_controller_1.NewsletterController.subscribeController);
router.post('/unsubscribe', newsletter_controller_1.NewsletterController.unsubscribeController);
router.post('/broadcast', newsletter_controller_1.NewsletterController.broadcastController);
router.get('/', newsletter_controller_1.NewsletterController.getAllSubscribersController);
exports.NewsletterRoutes = router;
//# sourceMappingURL=newsletter.route.js.map