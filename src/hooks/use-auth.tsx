

'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { app } from '@/lib/firebase-config';
import { useRouter, usePathname } from 'next/navigation';
import { getDocument, setDocument, checkAdminStatus, makeUserAdmin as makeUserAdminInDb } from '@/services/firestore';
import type { Character } from '@/lib/game-data';

const auth = getAuth(app);

interface AuthContextType {
  user: User | null;
  character: Character | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  adminLogin: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  saveCharacter: (characterData: Character) => Promise<void>;
  makeUserAdmin: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const protectedRoutes = ['/dashboard'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        const adminStatus = await checkAdminStatus(user.uid);
        setIsAdmin(adminStatus);
        
        const char = await getDocument<Character>('characters', user.uid);
        setCharacter(char);
        
        // This is for regular user flow, not admin
        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
        if (isProtectedRoute && !char && !pathname.startsWith('/dashboard/character/create') && !adminStatus) {
            router.push('/dashboard/character/create');
        }

      } else {
        // If no firebase user, check if there's an admin session
        const sessionAdmin = sessionStorage.getItem('isAdmin') === 'true';
        setIsAdmin(sessionAdmin);
        setUser(null);
        setCharacter(null);

        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
        if (isProtectedRoute && !sessionAdmin) {
          router.push('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);
  

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the user state update
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const adminLogin = async (email: string, pass: string) => {
    // This remains a "fake" admin login, but now it correctly sets state
    // which the login page can react to.
    if (email === 'admin@mundomitico.com' && pass === 'admin123') {
        sessionStorage.setItem('isAdmin', 'true');
        setIsAdmin(true);
        // Setting user and char to null is important for a clean admin state
        setUser(null); 
        setCharacter(null);
        return Promise.resolve(); // Indicate success
    } else {
        return Promise.reject(new Error('Credenciais de administrador inválidas.'));
    }
  };

  const logout = async () => {
    await signOut(auth); // This will sign out Google users
    sessionStorage.removeItem('isAdmin'); // This logs out the fake admin
    setIsAdmin(false);
    setUser(null);
    setCharacter(null);
    router.push('/login');
  };
  
  const saveCharacter = async (characterData: Character) => {
      if(user) {
          await setDocument('characters', user.uid, characterData);
          setCharacter(characterData);
      }
  }

  const makeUserAdmin = async (userId: string) => {
    await makeUserAdminInDb(userId);
    // If the admin is making themselves an admin, update the state
    if (user && user.uid === userId) {
        setIsAdmin(true);
    }
  }


  return (
    <AuthContext.Provider value={{ user, character, loading, isAdmin, signInWithGoogle, adminLogin, logout, saveCharacter, makeUserAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
