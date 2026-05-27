"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmbedding = void 0;
const getEmbedding = async (text) => {
    var _a;
    const apiKey = process.env.GEMINI_API_KEY;
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent';
    const response = await fetch(`${url}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content: { parts: [{ text }] },
            taskType: 'SEMANTIC_SIMILARITY',
            outputDimensionality: 768,
        }),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Embedding API error: ${error}`);
    }
    const data = await response.json();
    return ((_a = data.embedding) === null || _a === void 0 ? void 0 : _a.values) || [];
};
exports.getEmbedding = getEmbedding;
//# sourceMappingURL=embedding.js.map