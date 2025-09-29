'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/icons/logo';
import { Separator } from '@/components/ui/separator';

export default function SignupPage() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <header className="mb-8 flex justify-center">
          <Logo />
        </header>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-headline">Crie sua Lenda</CardTitle>
            <CardDescription>Junte-se à aventura com um único clique.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button onClick={signInWithGoogle} className="w-full">
                Criar conta com Google
              </Button>
              <div className="mt-4 text-center text-sm">
                Já tem uma conta?{' '}
                <Link href="/login" className="underline">
                  Entrar
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
