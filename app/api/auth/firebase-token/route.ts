import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import admin from '@/lib/firebase-admin';

/**
 * Endpoint to generate a Firebase custom token for the authenticated user
 * This allows Auth0 users to authenticate with Firebase
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Generate a custom token for the user
    const firebaseToken = await admin.auth().createCustomToken(session.user.id, {
      email: session.user.email,
      name: session.user.name,
      picture: session.user.picture,
    });
    
    return NextResponse.json({ token: firebaseToken });
  } catch (error) {
    console.error('Error generating Firebase token:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 