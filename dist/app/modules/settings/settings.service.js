"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsServices = void 0;
const settings_model_1 = require("./settings.model");
const getSettings = async () => { var _a; return (_a = (await settings_model_1.Settings.findOne().lean())) !== null && _a !== void 0 ? _a : {}; };
const updateSettings = async (payload) => settings_model_1.Settings.findOneAndUpdate({}, payload, { upsert: true, new: true }).lean();
exports.SettingsServices = { getSettings, updateSettings };
//# sourceMappingURL=settings.service.js.map