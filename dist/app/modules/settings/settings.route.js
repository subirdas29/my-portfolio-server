"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsRoutes = void 0;
const express_1 = require("express");
const settings_controller_1 = require("./settings.controller");
const router = (0, express_1.Router)();
router.get('/', settings_controller_1.SettingsController.getSettingsController);
router.patch('/', settings_controller_1.SettingsController.updateSettingsController);
exports.SettingsRoutes = router;
//# sourceMappingURL=settings.route.js.map