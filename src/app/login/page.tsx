'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons/logo';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@mundomitico.com' && password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
       // For admin, we might need a fake user session or a specific flow
       // For now, let's just push to dashboard and let the auth guard handle it if it fails
       // A proper solution would use Firebase custom claims for the admin role.
      signInWithGoogle(); // Let's use this to create a session.
    } else {
      localStorage.removeItem('isAdmin');
      toast({
        title: 'Credenciais de admin inválidas',
        description: 'Apenas administradores podem usar este formulário.',
        variant: 'destructive',
      });
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
            <CardTitle className="text-2xl font-headline">Bem-vindo de volta!</CardTitle>
            <CardDescription>Entre na sua conta para continuar sua aventura.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
                <Button variant="outline" onClick={signInWithGoogle}>
                    Entrar com Google
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                        Ou continue com
                        </span>
                    </div>
                </div>

                <form onSubmit={handleAdminLogin} className="grid gap-4">
                    <p className="text-center text-sm text-muted-foreground">Login de Administrador</p>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email de Admin</Label>
                        <Input id="email" type="email" placeholder="admin@mundomitico.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Senha de Admin</Label>
                        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <Button type="submit" className="w-full">
                        Entrar como Admin
                    </Button>
                </form>
            </div>
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
