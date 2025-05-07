export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  question: string;
  userId: string;
}

export interface ChatResponse {
  answer: string;
}

export interface PDFUploadResponse {
  success: boolean;
  error?: string;
} 