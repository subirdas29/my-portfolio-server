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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsServices = void 0;
const settings_model_1 = require("./settings.model");

const getSettings = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield settings_model_1.Settings.findOne().lean();
    return result || {};
});

const updateSettings = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield settings_model_1.Settings.findOneAndUpdate({}, payload, { upsert: true, new: true, runValidators: true }).lean();
    return result;
});

exports.SettingsServices = {
    getSettings,
    updateSettings,
};
