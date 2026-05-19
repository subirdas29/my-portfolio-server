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
exports.generateResponse = void 0;
const systemPrompt_1 = require("../data/systemPrompt");
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const callGemini = (apiKey, systemInstruction, userQuestion, history) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const contents = [];
    if (history && history.length > 0) {
        for (const h of history) {
            contents.push({
                role: h.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: h.content }],
            });
        }
    }
    contents.push({
        role: 'user',
        parts: [{ text: userQuestion }],
    });
    const response = yield fetch(`${GEMINI_BASE_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            systemInstruction: {
                parts: [{ text: systemInstruction }],
            },
            contents,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
            },
        }),
    });
    if (!response.ok) {
        const errorText = yield response.text();
        throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }
    const data = yield response.json();
    const text = ((_e = (_d = (_c = (_b = (_a = data.candidates) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.parts) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.text) || '';
    if (!text) {
        console.error('Gemini returned empty response:', JSON.stringify(data).slice(0, 500));
    }
    return text;
});
const generateResponse = (context, userQuestion, history) => __awaiter(void 0, void 0, void 0, function* () {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY is not configured');
        return null;
    }
    const siteUrl = process.env.PORTFOLIO_URL || 'http://localhost:3000';
    const systemMessage = `${(0, systemPrompt_1.buildSystemPrompt)(siteUrl)}\n\nContext:\n${context}`;
    const MAX_RETRIES = 2;
    for (let retry = 0; retry <= MAX_RETRIES; retry++) {
        try {
            const response = yield callGemini(apiKey, systemMessage, userQuestion, history);
            if (response)
                return response;
            return null;
        }
        catch (err) {
            const isRateLimited = err instanceof Error &&
                (err.message.includes('429') ||
                    err.message.includes('RESOURCE_EXHAUSTED'));
            const isLastRetry = retry === MAX_RETRIES;
            if (isRateLimited && !isLastRetry) {
                yield sleep(1000 * (retry + 1));
                continue;
            }
            console.error('Gemini API failed:', err);
            return null;
        }
    }
    return null;
});
exports.generateResponse = generateResponse;
