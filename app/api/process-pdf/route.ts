import { NextRequest, NextResponse } from 'next/server';
import { parsePDF } from '@/lib/pdf-parser';
import { pdfContents } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'File and userId are required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Validate file size (e.g., 10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Validate buffer
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
      return NextResponse.json(
        { error: 'Invalid file data' },
        { status: 400 }
      );
    }

    console.log(`Processing PDF file: ${file.name} (${buffer.length} bytes)`);
    
    // Parse PDF
    const content = await parsePDF(buffer);
    
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'No text content could be extracted from the PDF' },
        { status: 422 }
      );
    }

    // Store in memory (temporary)
    pdfContents.set(userId, content);

    console.log(`Successfully processed PDF file: ${file.name}`);

    return NextResponse.json({ 
      success: true,
      message: 'PDF processed successfully',
      contentLength: content.length
    });
  } catch (error) {
    console.error('PDF processing error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
