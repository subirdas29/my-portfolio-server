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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ subject, html }) {
    try {
        const data = yield resend.emails.send({
            from: 'Subir Portfolio <onboarding@resend.dev>',
            to: [process.env.MY_PERSONAL_EMAIL],
            subject: subject,
            html: html,
        });
        console.log('Resend Response:', data);
        return [data, null];
    }
    catch (error) {
        console.error('Resend Error:', error);
        return [null, error];
    }
});
exports.default = sendEmail;
