import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing Gemini API key');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getGeminiResponse(prompt: string, context: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const fullPrompt = `
    Context from the document:
    ${context}

    Question:
    ${prompt}

    Please answer based on the context provided. If the answer cannot be found in the context, please say so.
  `;

  const result = await model.generateContent(fullPrompt);
  const response = await result.response;
  return response.text();
} 