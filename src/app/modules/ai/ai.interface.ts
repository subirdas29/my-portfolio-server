export type TAIChat = {
  message: string;
};

export type TAIService = {
  getEmbedding: (text: string) => Promise<number[]>;
  upsertToAI: (doc: unknown) => Promise<void>;
  deleteFromAI: (id: string) => Promise<void>;
  searchPinecone: (query: string, topK?: number) => Promise<unknown[]>;
  generateResponse: (prompt: string) => Promise<string>;
  chat: (message: string) => Promise<{ success: boolean; message: string }>;
};
