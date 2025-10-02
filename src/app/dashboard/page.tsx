
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cog, Flame, Star, User } from 'lucide-react';
import Link from 'next/link';
import type { Character } from '@/lib/game-data';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function DashboardPage() {
  const { user, character, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if(authLoading) return; 
    if(!user) {
        router.push('/login');
        return;
    }
    // If loading is done and there's still no character, go to summoning.
    if(!character) {
        router.push('/dashboard/character/create');
        return;
    }

  }, [user, character, authLoading, router]);


  if (authLoading || !character || !character.servant) {
    return (
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="container mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Skeleton className="h-64 col-span-1" />
            <Skeleton className="h-64 col-span-1 md:col-span-2" />
            <Skeleton className="h-64 col-span-1" />
          </div>
        </main>
    );
  }

  const { servant } = character;

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
         <div className="mb-6">
            <h1 className="text-3xl font-headline font-bold text-primary">Bem-vindo, Mestre {character.name}</h1>
            <p className="text-muted-foreground">A Guerra pelo Santo Graal aguarda suas ordens.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {servant && (
                 <Card className="col-span-1 row-span-2 flex flex-col">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-2xl">{servant.className}</CardTitle>
                        <CardDescription>{servant.trueName}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col items-center justify-center">
                       <div className="relative w-48 h-64 rounded-md overflow-hidden border-2 border-primary/20 shadow-lg">
                         <Image src={servant.imageUrl} alt={servant.trueName} layout="fill" objectFit="cover" objectPosition="center" />
                       </div>
                    </CardContent>
                     <CardFooter>
                        <Button asChild className="w-full">
                            <Link href="/dashboard/character/sheet">Ver Ficha Completa do Servo</Link>
                        </Button>
                    </CardFooter>
                </Card>
            )}

            <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                    <CardTitle className="font-headline">Próximo Confronto</CardTitle>
                    <CardDescription>Um Mestre inimigo foi localizado no distrito do armazém.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
                    <div className="space-y-2">
                        <Badge variant="outline" className="border-red-500 text-red-400">Alto Risco</Badge>
                        <p className="text-sm"><strong className="text-foreground">Alvo:</strong> Servo da classe Caster</p>
                         <p className="text-sm"><strong className="text-foreground">Inteligência:</strong> O Mestre parece ser inexperiente.</p>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/dashboard/adventure">
                            <Flame className="mr-2"/> Iniciar Confronto
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><User className="text-primary"/> Mestre</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                     <div>
                        <p className="text-sm text-muted-foreground">Nome</p>
                        <p className="font-bold">{character.name}</p>
                    </div>
                     <div>
                        <p className="text-sm text-muted-foreground">Nível</p>
                        <p className="font-bold">{character.level}</p>
                    </div>
                </CardContent>
            </Card>

             <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader>
                    <CardTitle className="font-headline">Resumo da Guerra</CardTitle>
                </CardHeader>
                <CardContent>
                   <p className="text-muted-foreground">A guerra está apenas começando. 6 Mestres inimigos e seus Servos ainda estão ativos.</p>
                </CardContent>
            </Card>

             {isAdmin && (
                <Card className="col-span-1 flex flex-col border-accent/20">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="bg-accent/10 p-3 rounded-md">
                        <Cog className="size-6 text-accent" />
                        </div>
                        <CardTitle className="font-headline text-2xl text-accent">Painel Admin</CardTitle>
                    </div>
                    <CardDescription>Gerencie as configurações do jogo.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
                    <p className="text-muted-foreground mb-4">Acesse a área de administração.</p>
                    <Button asChild variant="outline">
                        <Link href="/dashboard/admin">
                            Ir para Admin
                        </Link>
                    </Button>
                </CardContent>
                </Card>
            )}

        </div>
      </div>
    </main>
  );
}
