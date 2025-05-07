// Serverless-friendly storage for PDF content (uses filesystem in development and global variables in serverless)
import { kv } from '@vercel/kv';

// Fallback to in-memory when Vercel KV isn't available
const localStore: Map<string, string> = new Map();

export async function storePdfContent(userId: string, content: string): Promise<void> {
  try {
    if (process.env.VERCEL) {
      // On Vercel, use KV store
      if (!process.env.KV_URL) {
        console.warn('KV_URL not provided, falling back to memory storage (not reliable in serverless)');
        localStore.set(userId, content);
        return;
      }
      
      await kv.set(`pdf:${userId}`, content);
      console.log(`Stored PDF content for user ${userId} in KV store`);
    } else {
      // In development, use memory
      localStore.set(userId, content);
      console.log(`Stored PDF content for user ${userId} in memory`);
    }
  } catch (error) {
    console.error('Error storing PDF content:', error);
    // Fallback to in-memory store
    localStore.set(userId, content);
  }
}

export async function getPdfContent(userId: string): Promise<string | null> {
  try {
    if (process.env.VERCEL) {
      // On Vercel, use KV store
      if (!process.env.KV_URL) {
        console.warn('KV_URL not provided, falling back to memory storage (not reliable in serverless)');
        return localStore.get(userId) || null;
      }
      
      const content = await kv.get(`pdf:${userId}`);
      return content as string || null;
    } else {
      // In development, use memory
      return localStore.get(userId) || null;
    }
  } catch (error) {
    console.error('Error retrieving PDF content:', error);
    // Fallback to in-memory store
    return localStore.get(userId) || null;
  }
} 