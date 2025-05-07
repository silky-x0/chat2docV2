import pdf from 'pdf-parse';

export async function parsePDF(buffer: Buffer): Promise<string> {
  try {
    // Ensure we have a valid buffer
    if (!Buffer.isBuffer(buffer)) {
      throw new Error('Input must be a Buffer');
    }

    // Pass the buffer directly to pdf-parse
    const data = await pdf(buffer, {
      // Add options to handle potential parsing issues
      max: 0, // No page limit
      version: 'v2.0.550' // Use latest version
    });

    if (!data || typeof data.text !== 'string') {
      throw new Error('Failed to extract text from PDF');
    }

    return data.text.trim();
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
  }
}

export function splitIntoChunks(text: string, maxChunkSize: number = 4000): string[] {
  const words = text.split(' ');
  const chunks: string[] = [];
  let currentChunk = '';

  for (const word of words) {
    if ((currentChunk + ' ' + word).length <= maxChunkSize) {
      currentChunk += (currentChunk ? ' ' : '') + word;
    } else {
      chunks.push(currentChunk);
      currentChunk = word;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
} 