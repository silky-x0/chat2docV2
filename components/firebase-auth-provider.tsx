"use client";

import { useEffect, createContext, useContext, useState, ReactNode } from "react";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { signInWithAuth0Token } from "@/lib/auth";

interface FirebaseAuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType>({
  user: null,
  loading: true,
});

export const useFirebaseAuth = () => useContext(FirebaseAuthContext);

interface FirebaseAuthProviderProps {
  children: ReactNode;
}

export function FirebaseAuthProvider({ children }: FirebaseAuthProviderProps) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Handle Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle Auth0 authentication
  useEffect(() => {
    const handleAuth0Login = async () => {
      try {
        // Check if user is already authenticated with Firebase
        if (auth.currentUser) return;

        // Check if user is authenticated with Auth0
        const response = await fetch("/api/auth/me");
        if (!response.ok) return;

        // Get Firebase token
        const tokenResponse = await fetch("/api/auth/firebase-token");
        if (!tokenResponse.ok) return;

        const { token } = await tokenResponse.json();
        if (!token) return;

        // Sign in to Firebase with custom token
        await signInWithAuth0Token(token);
      } catch (error) {
        console.error("Error syncing Auth0 with Firebase:", error);
      }
    };

    handleAuth0Login();
  }, []);

  return (
    <FirebaseAuthContext.Provider value={{ user, loading }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
} 