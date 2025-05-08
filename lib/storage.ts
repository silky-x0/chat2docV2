// Serverless-friendly storage for PDF content (uses filesystem in development and global variables in serverless)
import { db } from './firebase';
import { doc, setDoc, getDoc, collection } from 'firebase/firestore';

// Fallback to in-memory when Firebase isn't initialized or in development environment
const localStore: Map<string, string> = new Map();

/**
 * Store PDF content in Firebase Firestore
 * @param userId User ID to associate with the content
 * @param content PDF content as text
 */
export async function storePdfContent(userId: string, content: string): Promise<void> {
  if (!userId) {
    console.error('No userId provided for storing PDF content');
    throw new Error('User ID is required');
  }

  if (!content) {
    console.error('No content provided for storing PDF');
    throw new Error('Content is required');
  }

  try {
    console.log(`Attempting to store ${content.length} characters for user ${userId} in Firestore`);
    
    // Store in Firestore
    const pdfDocRef = doc(db, 'pdfContents', userId);
    await setDoc(pdfDocRef, {
      content,
      updatedAt: new Date().toISOString(),
    });
    
    console.log(`Successfully stored PDF content for user ${userId} in Firestore`);
  } catch (error) {
    console.error(`Error storing PDF content in Firestore for user ${userId}:`, error);
    // Fallback to in-memory store
    localStore.set(userId, content);
    console.log(`Stored PDF content for user ${userId} in memory (fallback)`);
  }
}

/**
 * Retrieve PDF content from Firebase Firestore
 * @param userId User ID to retrieve content for
 * @returns PDF content as text, or null if not found
 */
export async function getPdfContent(userId: string): Promise<string | null> {
  if (!userId) {
    console.error('No userId provided for retrieving PDF content');
    throw new Error('User ID is required');
  }

  try {
    console.log(`Attempting to retrieve PDF content for user ${userId} from Firestore`);
    
    // Get from Firestore
    const pdfDocRef = doc(db, 'pdfContents', userId);
    const pdfDoc = await getDoc(pdfDocRef);
    
    if (pdfDoc.exists()) {
      const data = pdfDoc.data();
      console.log(`Retrieved PDF content for user ${userId} from Firestore, data exists:`, !!data);
      
      if (data && data.content) {
        console.log(`Content length: ${data.content.length} characters`);
        return data.content;
      } else {
        console.log('Content field is empty or undefined');
        return null;
      }
    } else {
      console.log(`No document found for user ${userId} in Firestore`);
    }
    
    // Try fallback
    const localContent = localStore.get(userId);
    console.log(`Local fallback content for user ${userId} exists:`, !!localContent);
    return localContent || null;
  } catch (error) {
    console.error(`Error retrieving PDF content from Firestore for user ${userId}:`, error);
    // Fallback to in-memory store
    const localContent = localStore.get(userId);
    console.log(`Local fallback content for user ${userId} exists:`, !!localContent);
    return localContent || null;
  }
}

/**
 * Store chat history in Firebase Firestore
 * @param userId User ID to associate with the chat history
 * @param question User's question
 * @param answer AI's answer
 */
export async function storeChatHistory(userId: string, question: string, answer: string): Promise<void> {
  if (!userId) {
    console.error('No userId provided for storing chat history');
    throw new Error('User ID is required');
  }

  try {
    const chatCollection = collection(db, 'chatHistory');
    const chatDoc = doc(chatCollection); // Auto-generate ID
    
    await setDoc(chatDoc, {
      userId,
      question,
      answer,
      timestamp: new Date().toISOString(),
    });
    
    console.log(`Stored chat history for user ${userId} in Firestore`);
  } catch (error) {
    console.error(`Error storing chat history in Firestore for user ${userId}:`, error);
  }
}

/**
 * Get chat history for a user from Firebase Firestore
 * @param userId User ID to retrieve chat history for
 * @returns Array of chat history items
 */
export async function getChatHistory(userId: string): Promise<Array<{question: string, answer: string, timestamp: string}>> {
  if (!userId) {
    console.error('No userId provided for retrieving chat history');
    throw new Error('User ID is required');
  }

  try {
    const chatCollection = collection(db, 'chatHistory');
    const chatDocs = await getDoc(doc(chatCollection, userId));
    
    if (chatDocs.exists()) {
      return chatDocs.data().history || [];
    }
    
    return [];
  } catch (error) {
    console.error(`Error retrieving chat history from Firestore for user ${userId}:`, error);
    return [];
  }
} 