
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, ShieldPlus, Cog, BookUser, Swords, Shield, Wand, ArrowBigUpDash, Map, Flame, Star } from 'lucide-react';
import Link from 'next/link';
import type { Character } from '@/lib/game-data';

export default function DashboardPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);

    const charData = localStorage.getItem('character');
    if (charData) {
      setCharacter(JSON.parse(charData));
    } else {
        // Create a default character if one doesn't exist for UI purposes
        const defaultCharacter: Character = {
            id: 'char-default',
            name: 'Aventureiro',
            race: 'human',
            gameClass: 'warrior',
            level: 1,
        };
        setCharacter(defaultCharacter);
        localStorage.setItem('character', JSON.stringify(defaultCharacter));
    }
  }, []);

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {character && (
                 <Card className="col-span-1">
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-2xl">{character.name}</CardTitle>
                        <CardDescription>Nível {character.level} Explorador</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">XP</p>
                            <Progress value={45} className="mt-1" />
                            <p className="text-xs text-muted-foreground mt-1">45 / 100 XP</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <p className="font-bold text-lg text-primary">12</p>
                                <p className="text-sm text-muted-foreground">Missões Completas</p>
                            </div>
                            <div>
                                <p className="font-bold text-lg text-primary">87</p>
                                <p className="text-sm text-muted-foreground">Inimigos Derrotados</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                    <CardTitle className="font-headline">Próxima Aventura</CardTitle>
                    <CardDescription>Os testes no dojo sagrado de mestres antigos aguardam.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:justify-between">
                    <div className="space-y-2">
                        <Badge variant="outline" className="border-green-500 text-green-400">Fácil</Badge>
                        <p className="text-sm"><strong className="text-foreground">Recompensa:</strong> +50 XP, Amuleto do Sábio</p>
                         <p className="text-sm"><strong className="text-foreground">Nível Rec:</strong> 1+</p>
                    </div>
                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/dashboard/adventure">
                            <Flame className="mr-2"/> Começar Missão
                        </Link>
                    </Button>
                </CardContent>
                 <CardFooter>
                    <Button variant="outline" className="w-full">Ver Todas as Aventuras</Button>
                </CardFooter>
            </Card>

            <Card className="col-span-1">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Star className="text-primary"/> Habilidades</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><Swords className="text-red-400" size={18}/><span>Ataque</span></div>
                        <span className="font-bold">15</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><Shield className="text-blue-400" size={18}/><span>Defesa</span></div>
                        <span className="font-bold">12</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><ArrowBigUpDash className="text-green-400" size={18}/><span>Agilidade</span></div>
                        <span className="font-bold">18</span>
                    </div>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2"><Wand className="text-purple-400" size={18}/><span>Magia</span></div>
                        <span className="font-bold">5</span>
                    </div>
                </CardContent>
            </Card>

             <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader>
                    <CardTitle className="font-headline">Meu Inventário</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 text-center">
                        <div className="border rounded-lg p-2 aspect-square flex flex-col justify-center items-center bg-black/20"><p className="text-sm">Espada Longa</p><p className="text-xs text-primary">+5 Dano</p></div>
                        <div className="border rounded-lg p-2 aspect-square flex flex-col justify-center items-center bg-black/20"><p className="text-sm">Poção de Cura</p><p className="text-xs text-green-400">Cura 25 HP</p></div>
                        <div className="border rounded-lg p-2 aspect-square flex flex-col justify-center items-center bg-black/20"><p className="text-sm">Mapa Antigo</p></div>
                         <div className="border rounded-lg p-2 aspect-square flex flex-col justify-center items-center border-dashed border-muted-foreground/50 text-muted-foreground">Vazio</div>
                         <div className="border rounded-lg p-2 aspect-square flex flex-col justify-center items-center border-dashed border-muted-foreground/50 text-muted-foreground">Vazio</div>
                    </div>
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
