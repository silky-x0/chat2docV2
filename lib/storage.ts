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
  try {
    // Store in Firestore
    const pdfDocRef = doc(collection(db, 'pdfContents'), userId);
    await setDoc(pdfDocRef, {
      content,
      updatedAt: new Date().toISOString(),
    });
    console.log(`Stored PDF content for user ${userId} in Firestore`);
  } catch (error) {
    console.error('Error storing PDF content in Firestore:', error);
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
  try {
    // Get from Firestore
    const pdfDocRef = doc(collection(db, 'pdfContents'), userId);
    const pdfDoc = await getDoc(pdfDocRef);
    
    if (pdfDoc.exists()) {
      return pdfDoc.data().content || null;
    }
    
    // Try fallback
    return localStore.get(userId) || null;
  } catch (error) {
    console.error('Error retrieving PDF content from Firestore:', error);
    // Fallback to in-memory store
    return localStore.get(userId) || null;
  }
}

/**
 * Store chat history in Firebase Firestore
 * @param userId User ID to associate with the chat history
 * @param question User's question
 * @param answer AI's answer
 */
export async function storeChatHistory(userId: string, question: string, answer: string): Promise<void> {
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
    console.error('Error storing chat history in Firestore:', error);
  }
}

/**
 * Get chat history for a user from Firebase Firestore
 * @param userId User ID to retrieve chat history for
 * @returns Array of chat history items
 */
export async function getChatHistory(userId: string): Promise<Array<{question: string, answer: string, timestamp: string}>> {
  try {
    const chatCollection = collection(db, 'chatHistory');
    const chatDocs = await getDoc(doc(chatCollection, userId));
    
    if (chatDocs.exists()) {
      return chatDocs.data().history || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error retrieving chat history from Firestore:', error);
    return [];
  }
} 