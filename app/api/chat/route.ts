import { NextRequest, NextResponse } from 'next/server';
import { getGeminiResponse } from '@/lib/gemini';
import { splitIntoChunks } from '@/lib/pdf-parser';
import { pdfContents } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const { question, userId } = await request.json();

    if (!question || !userId) {
      return NextResponse.json(
        { error: 'Question and userId are required' },
        { status: 400 }
      );
    }

    // Get PDF content from memory
    const content = pdfContents.get(userId);
    if (!content) {
      return NextResponse.json(
        { error: 'No PDF content found. Please upload a PDF first.' },
        { status: 404 }
      );
    }

    // Split content into chunks if it's too long
    const chunks = splitIntoChunks(content);
    
    // For simplicity, we'll use the first chunk only
    // In a production environment, you'd want to implement a more sophisticated
    // chunking and context selection strategy
    const context = chunks[0];

    // Get response from Gemini
    const answer = await getGeminiResponse(question, context);

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process question' },
      { status: 500 }
    );
  }
}
