
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
  saveCharacter: (characterData: Omit<Character, 'id'> | Character) => Promise<void>;
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
        sessionStorage.removeItem('isAdmin'); 
        
        const char = await getDocument<Character>('characters', user.uid);
        setCharacter(char);
        
        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
        if (isProtectedRoute && !char && !pathname.startsWith('/dashboard/character/create') && !adminStatus) {
            router.push('/dashboard/character/create');
        }

      } else {
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
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const adminLogin = async (email: string, pass: string) => {
    if (email === 'admin@mundomitico.com' && pass === 'admin123') {
        sessionStorage.setItem('isAdmin', 'true');
        setIsAdmin(true);
        setUser(null); 
        setCharacter(null);
        setLoading(false);
        router.push('/dashboard');
    } else {
        throw new Error('Credenciais de administrador inválidas.');
    }
  };

  const logout = async () => {
    await signOut(auth);
    sessionStorage.removeItem('isAdmin');
    setIsAdmin(false);
    setUser(null);
    setCharacter(null);
    router.push('/login');
  };
  
  const saveCharacter = async (characterData: Omit<Character, 'id'> | Character) => {
      if(user) {
          const dataToSave = 'id' in characterData ? characterData : { ...characterData, id: user.uid };
          await setDocument('characters', user.uid, dataToSave);
          setCharacter(dataToSave as Character);
      }
  }

  const makeUserAdmin = async (userId: string) => {
    await makeUserAdminInDb(userId);
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
