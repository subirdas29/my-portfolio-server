"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    type: String,
    message: String,
    read: { type: Boolean, default: false },
    link: String,
    createdAt: { type: Date, default: Date.now },
});
exports.Notification = (0, mongoose_1.model)('Notification', notificationSchema);
//# sourceMappingURL=notification.model.js.map