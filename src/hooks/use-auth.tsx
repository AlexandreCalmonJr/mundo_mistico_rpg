

'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup, User } from 'firebase/auth';
import { app } from '@/lib/firebase-config';
import { useRouter, usePathname } from 'next/navigation';
import { getDocument, setDocument, checkAdminStatus } from '@/services/firestore';
import type { Character } from '@/lib/game-data';

const auth = getAuth(app);

interface AuthContextType {
  user: User | null;
  character: Character | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  saveCharacter: (characterData: Character) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const protectedRoutes = ['/dashboard'];
const adminLoginRoute = '/login/admin'; // A separate route for initial admin setup if needed

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

        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
        if (isProtectedRoute && !char && !pathname.startsWith('/dashboard/character/create') && !pathname.startsWith('/dashboard/admin')) {
            router.push('/dashboard/character/create');
        } else if (!isProtectedRoute && pathname !== '/') {
            router.push('/dashboard');
        }

      } else {
        setUser(null);
        setCharacter(null);
        setIsAdmin(false);
        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
        if (isProtectedRoute) {
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
      // onAuthStateChanged will handle the redirect
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const logout = async () => {
    await signOut(auth);
    // onAuthStateChanged will handle the redirect
  };
  
  const saveCharacter = async (characterData: Character) => {
      if(user) {
          await setDocument('characters', user.uid, characterData);
          setCharacter(characterData);
      }
  }

  return (
    <AuthContext.Provider value={{ user, character, loading, isAdmin, signInWithGoogle, logout, saveCharacter }}>
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
