import { cookies } from "next/headers"
import { Auth0Client } from "@auth0/auth0-spa-js"
import { auth as firebaseAuth } from './firebase';
import { 
  signInWithCustomToken, 
  signOut as firebaseSignOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';

interface User {
  email: string
  name: string
  picture: string
}

interface Session {
  user?: {
    id: string;
    name?: string;
    email?: string;
    picture?: string;
  };
  anonymousId?: string;
  questionCount?: number;
}

function validateConfig() {
  const requiredEnvVars = [
    'AUTH0_DOMAIN',
    'AUTH0_CLIENT_ID',
    'AUTH0_CLIENT_SECRET',
    'AUTH0_REDIRECT_URI'
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
}

export async function createAuth0Client() {
  validateConfig()

  const auth0 = new Auth0Client({
    domain: process.env.AUTH0_DOMAIN!,
    client_id: process.env.AUTH0_CLIENT_ID!,
    client_secret: process.env.AUTH0_CLIENT_SECRET!,
    redirect_uri: process.env.AUTH0_REDIRECT_URI!,
  })

  return {
    getAuthorizationUrl: async ({ returnTo, screenHint }: { returnTo: string; screenHint?: string }) => {
      const params = new URLSearchParams({
        client_id: process.env.AUTH0_CLIENT_ID!,
        redirect_uri: process.env.AUTH0_REDIRECT_URI!,
        response_type: 'code',
        scope: process.env.AUTH0_SCOPE || 'openid profile email',
        returnTo,
      })

      if (screenHint) {
        params.append('screen_hint', screenHint)
      }

      return `https://${process.env.AUTH0_DOMAIN}/authorize?${params.toString()}`
    },

    handleCallback: async (request: Request) => {
      const url = new URL(request.url)
      const code = url.searchParams.get('code')

      if (!code) {
        throw new Error('No authorization code received')
      }

      try {
        const tokenResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            grant_type: 'authorization_code',
            client_id: process.env.AUTH0_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            code,
            redirect_uri: process.env.AUTH0_REDIRECT_URI
          })
        })

        const tokens = await tokenResponse.json()

        if (!tokenResponse.ok) {
          throw new Error(tokens.error_description || 'Failed to get tokens')
        }

        // Get user info
        const userInfoResponse = await fetch(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
          headers: { Authorization: `Bearer ${tokens.access_token}` }
        })

        const user = await userInfoResponse.json()

        if (!userInfoResponse.ok) {
          throw new Error('Failed to get user info')
        }

        return { user, accessToken: tokens.access_token }
      } catch (error) {
        console.error('Token exchange error:', error)
        throw error
      }
    },

    getLogoutUrl: async ({ returnTo }: { returnTo: string }) => {
      const params = new URLSearchParams({
        client_id: process.env.AUTH0_CLIENT_ID!,
        returnTo,
      })

      return `https://${process.env.AUTH0_DOMAIN}/v2/logout?${params.toString()}`
    },
  }
}

// Cache the session to avoid unnecessary fetch requests
let cachedSession: Session | null = null;

/**
 * Get the current session, which will include either a authenticated user or an anonymous ID
 */
export async function getSession(): Promise<Session | null> {
  if (cachedSession) return cachedSession;

  try {
    // Get the Auth0 session
    const res = await fetch('/api/auth/me');
    
    if (res.ok) {
      const user = await res.json();
      
      if (user) {
        cachedSession = { user };
        return cachedSession;
      }
    }
    
    // If no authenticated user, generate or retrieve an anonymous ID from local storage
    let anonymousId = '';
    
    if (typeof window !== 'undefined') {
      anonymousId = localStorage.getItem('anonymousId') || '';
      
      if (!anonymousId) {
        anonymousId = uuidv4();
        localStorage.setItem('anonymousId', anonymousId);
      }
    } else {
      // Server-side: generate a temporary ID
      anonymousId = uuidv4();
    }
    
    // Get question count for anonymous users
    const questionCount = 0; // You would implement this to track question count
    
    cachedSession = { anonymousId, questionCount };
    return cachedSession;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Sign in to Firebase with a custom token from Auth0
 * This should be called after Auth0 authentication
 */
export async function signInWithAuth0Token(token: string): Promise<FirebaseUser | null> {
  try {
    // Sign in to Firebase with custom token from Auth0
    const userCredential = await signInWithCustomToken(firebaseAuth, token);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in with Auth0 token:', error);
    return null;
  }
}

/**
 * Sign out from both Auth0 and Firebase
 */
export async function signOut(): Promise<void> {
  try {
    // Safety check in case we're in a server environment
    if (typeof window === 'undefined') {
      console.warn('Cannot sign out in server environment');
      return;
    }
    
    // Sign out from Firebase if available
    if (firebaseAuth && firebaseAuth.currentUser) {
      console.log('Signing out from Firebase');
      await firebaseSignOut(firebaseAuth);
    }

    // Log the sign-out action
    console.log('User signed out successfully');
    
    // The Auth0 logout will be handled by the Auth context, which redirects to /api/auth/logout
  } catch (error) {
    console.error('Error signing out:', error);
    throw error; // Rethrow for handling in UI components
  }
}

/**
 * Get the current Firebase user
 */
export function getCurrentUser(): FirebaseUser | null {
  return firebaseAuth.currentUser;
}
