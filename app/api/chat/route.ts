import { NextRequest, NextResponse } from 'next/server';
import { getGeminiResponse } from '@/lib/gemini';
import { splitIntoChunks } from '@/lib/pdf-parser';
import { getPdfContent } from '@/lib/storage';

// Add initialization check
let isInitialized = false;

export async function POST(request: NextRequest) {
  try {
    // Set initialization flag on first request
    if (!isInitialized) {
      isInitialized = true;
    }

    const { question, userId } = await request.json();

    if (!question || !userId) {
      return NextResponse.json(
        { error: 'Question and userId are required' },
        { status: 400 }
      );
    }

    // Get PDF content from storage
    const content = await getPdfContent(userId);
    
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

    try {
      // Get response from Gemini
      const answer = await getGeminiResponse(question, context);
      return NextResponse.json({ answer });
    } catch (error) {
      console.error('Gemini API error:', error);
      return NextResponse.json(
        { error: 'Failed to generate response' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Chat error:', error);
    
    // Handle initialization errors differently
    if (!isInitialized) {
      return NextResponse.json(
        { error: 'Service initializing' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process question' },
      { status: 500 }
    );
  }
}
