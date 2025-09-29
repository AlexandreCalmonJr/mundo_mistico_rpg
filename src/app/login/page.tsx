'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/icons/logo';
import { useToast } from '@/hooks/use-toast';


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading, signInWithGoogle, adminLogin } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);
  
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      adminLogin(email, password);
      router.push('/dashboard');
    } catch(err) {
      if (err instanceof Error) {
        toast({
            title: 'Erro de Login',
            description: err.message,
            variant: 'destructive',
        });
      }
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
            <CardTitle className="text-2xl font-headline">Bem-vindo!</CardTitle>
            <CardDescription>Entre na sua conta para continuar sua aventura.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
                <Button variant="outline" onClick={signInWithGoogle}>
                    Entrar com Google (Jogadores)
                </Button>
            </div>
             <Separator className="my-6" />
             <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email (Admin)</Label>
                    <Input id="email" type="email" placeholder="admin@mundomitico.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Senha (Admin)</Label>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full">Entrar como Admin</Button>
             </form>
            <div className="mt-4 text-center text-sm">
              Não tem uma conta?{' '}
              <Link href="/signup" className="underline">
                Criar conta
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
