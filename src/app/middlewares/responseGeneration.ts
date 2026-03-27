import { buildSystemPrompt } from '../data/systemPrompt';

const GEMINI_BASE_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const callGemini = async (
  apiKey: string,
  systemInstruction: string,
  userQuestion: string,
  history?: { role: 'user' | 'assistant'; content: string }[],
): Promise<string> => {
  const contents: { role: string; parts: { text: string }[] }[] = [];

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

  const response = await fetch(`${GEMINI_BASE_URL}?key=${apiKey}`, {
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
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (!text) {
    console.error(
      'Gemini returned empty response:',
      JSON.stringify(data).slice(0, 500),
    );
  }

  return text;
};

export const generateResponse = async (
  context: string,
  userQuestion: string,
  history?: { role: 'user' | 'assistant'; content: string }[],
): Promise<string | null> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY is not configured');
    return null;
  }

  const siteUrl = process.env.PORTFOLIO_URL || 'http://localhost:3000';
  const systemMessage = `${buildSystemPrompt(siteUrl)}\n\nContext:\n${context}`;

  const MAX_RETRIES = 2;
  for (let retry = 0; retry <= MAX_RETRIES; retry++) {
    try {
      const response = await callGemini(
        apiKey,
        systemMessage,
        userQuestion,
        history,
      );
      if (response) return response;
      return null;
    } catch (err: unknown) {
      const isRateLimited =
        err instanceof Error &&
        (err.message.includes('429') ||
          err.message.includes('RESOURCE_EXHAUSTED'));
      const isLastRetry = retry === MAX_RETRIES;

      if (isRateLimited && !isLastRetry) {
        await sleep(1000 * (retry + 1));
        continue;
      }

      console.error('Gemini API failed:', err);
      return null;
    }
  }

  return null;
};
