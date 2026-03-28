import catchAsync from '../../utils/catchAsync';
import { AIServices, IChatHistory } from './ai.service';
import { ChatLog } from './chatLog.model';

const chat = catchAsync(async (req, res) => {
  const { message, history } = req.body;

  console.log('💬 Received chat message:', message);

  const chatHistory: IChatHistory[] = Array.isArray(history)
    ? history.filter(
        (h: IChatHistory) =>
          h &&
          (h.role === 'user' || h.role === 'assistant') &&
          typeof h.content === 'string',
      )
    : [];

  const result = await AIServices.chat(message, chatHistory);

  // Log only FAILED or low-score interactions to keep DB lean
  const shouldLog =
    result.status === 'FAILED' || (result.score && result.score < 0.5);

  if (shouldLog) {
    await ChatLog.create({
      query: message,
      response: result.message,
      score: result.score || 0,
      status: (result.status as 'SUCCESS' | 'FAILED') || 'FAILED',
    });
  }

  res.status(200).json({
    success: result.success,
    message: result.message,
    projects: result.projects,
    skills: result.skills,
    blogs: result.blogs,
  });
});

export const AIController = {
  chat,
};
