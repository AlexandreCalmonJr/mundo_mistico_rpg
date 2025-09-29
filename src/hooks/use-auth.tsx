

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
  adminLogin: (email: string, pass: string) => void;
  logout: () => Promise<void>;
  saveCharacter: (characterData: Character) => Promise<void>;
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
      
      const localAdmin = sessionStorage.getItem('isAdmin') === 'true';
      
      if (user) {
        setUser(user);
        
        const adminStatus = await checkAdminStatus(user.uid);
        setIsAdmin(adminStatus || localAdmin);

        const char = await getDocument<Character>('characters', user.uid);
        setCharacter(char);

        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
        if (isProtectedRoute && !char && !pathname.startsWith('/dashboard/character/create') && !pathname.startsWith('/dashboard/admin')) {
            router.push('/dashboard/character/create');
        } else if (!isProtectedRoute && pathname !== '/') {
            router.push('/dashboard');
        }

      } else if (localAdmin) {
        setUser(null);
        setCharacter(null);
        setIsAdmin(true);
        // keep admin logged in
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
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const adminLogin = (email: string, pass: string) => {
    if (email === 'admin@mundomitico.com' && pass === 'admin123') {
        sessionStorage.setItem('isAdmin', 'true');
        setIsAdmin(true);
        setUser(null); 
        setCharacter(null);
    } else {
        throw new Error('Credenciais de administrador inválidas.');
    }
  };

  const logout = async () => {
    await signOut(auth);
    sessionStorage.removeItem('isAdmin');
    setIsAdmin(false);
  };
  
  const saveCharacter = async (characterData: Character) => {
      if(user) {
          await setDocument('characters', user.uid, characterData);
          setCharacter(characterData);
      }
  }

  return (
    <AuthContext.Provider value={{ user, character, loading, isAdmin, signInWithGoogle, adminLogin, logout, saveCharacter }}>
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
