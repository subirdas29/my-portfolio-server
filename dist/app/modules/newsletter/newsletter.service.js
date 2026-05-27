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
exports.NewsletterServices = void 0;
const newsletter_model_1 = require("./newsletter.model");

const subscribe = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const existing = yield newsletter_model_1.Newsletter.findOne({ email }).lean();
    if (existing) {
        if (!existing.active) {
            return newsletter_model_1.Newsletter.findOneAndUpdate({ email }, { $set: { active: true } }, { new: true }).lean();
        }
        return existing;
    }
    const result = yield newsletter_model_1.Newsletter.create({ email });
    return result.toObject();
});

const unsubscribe = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return newsletter_model_1.Newsletter.findOneAndUpdate({ email }, { $set: { active: false } }, { new: true }).lean();
});

const getAllSubscribers = () => __awaiter(void 0, void 0, void 0, function* () {
    return newsletter_model_1.Newsletter.find({ active: true }).sort('-subscribedAt').lean();
});

exports.NewsletterServices = {
    subscribe,
    unsubscribe,
    getAllSubscribers,
};
