"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const sendEmail = async ({ to, subject, html, replyTo }) => {
    try {
        const data = await resend.emails.send({
            from: 'Subir Portfolio <onboarding@resend.dev>',
            to: [process.env.MY_PERSONAL_EMAIL],
            replyTo: replyTo || to,
            subject: to ? `[To: ${to}] ${subject}` : subject,
            html: html,
        });
        console.log('Resend Response:', data);
        return [data, null];
    }
    catch (error) {
        console.error('Resend Error:', error);
        return [null, error];
    }
};
exports.default = sendEmail;
//# sourceMappingURL=sendEmail.js.map