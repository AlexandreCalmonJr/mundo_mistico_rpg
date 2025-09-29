
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons/logo';
import { useToast } from '@/hooks/use-toast';


export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { isAdmin, loading, adminLogin } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // This effect will react to changes in `isAdmin` state and redirect accordingly.
    if (!loading && isAdmin) {
      router.push('/dashboard');
    }
  }, [isAdmin, loading, router]);
  
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      // adminLogin will set the isAdmin state, and the useEffect above will handle the redirect.
      await adminLogin(email, password);
    } catch(err) {
      if (err instanceof Error) {
        toast({
            title: 'Erro de Login',
            description: err.message,
            variant: 'destructive',
        });
      }
      setIsLoggingIn(false); // Only set to false on error, on success we redirect
    }
  };


  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <header className="mb-8 flex justify-center">
          <Logo />
        </header>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Acesso Administrativo</CardTitle>
            <CardDescription>Use suas credenciais de administrador para gerenciar o Mundo Mítico.</CardDescription>
          </CardHeader>
          <CardContent>
             <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="admin@mundomitico.com" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoggingIn} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} disabled={isLoggingIn} />
                </div>
                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                    {isLoggingIn ? 'Entrando...' : 'Entrar como Admin'}
                </Button>
             </form>
            <div className="mt-4 text-center text-sm">
              <Link href="/login" className="underline">
                Voltar para o login de jogador
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
