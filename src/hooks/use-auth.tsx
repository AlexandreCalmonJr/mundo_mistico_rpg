
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
const adminOnlyRoutes = ['/dashboard/admin'];


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed. User:', user ? user.uid : null);
      setLoading(true);
      
      const sessionAdmin = sessionStorage.getItem('isAdmin') === 'true';
      console.log(`Session admin status: ${sessionAdmin}`);
      setIsAdmin(sessionAdmin);

      if (user) {
        console.log('User is present. Fetching data...');
        setUser(user);
        const adminStatus = await checkAdminStatus(user.uid) || sessionAdmin;
        setIsAdmin(adminStatus);
        
        const char = await getDocument<Character>('characters', user.uid);
        setCharacter(char);
        
        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
        if (isProtectedRoute && !char && !pathname.startsWith('/dashboard/character/create') && !adminStatus) {
            console.log('Redirecting to character creation...');
            router.push('/dashboard/character/create');
        }

      } else {
        console.log('No user from Firebase. Checking session admin.');
        setUser(null);
        setCharacter(null);

        const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
        const isAdminLoginPage = pathname === '/admin-login';

        if (isProtectedRoute && !sessionAdmin && !isAdminLoginPage) {
            console.log(`Protected route (${pathname}) and not session admin. Redirecting to /login.`);
            router.push('/login');
        } else {
             console.log('Either not a protected route or is session admin. No redirect needed.');
        }
      }
      console.log('Finished auth check. Loading set to false.');
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
    console.log(`Attempting admin login with email: ${email}`);
    if ((email === 'alexandrecalmonjunior@gmail.com' || email === 'admin@mundomitico.com') && pass === 'admin123') {
        console.log('Admin credentials valid. Setting session admin status.');
        sessionStorage.setItem('isAdmin', 'true');
        setIsAdmin(true);
    } else {
        console.log('Admin credentials invalid.');
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
