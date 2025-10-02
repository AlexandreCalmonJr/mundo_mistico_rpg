
'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Character, Servant } from '@/lib/game-data';
import { generateServant, GenerateServantInput } from '@/ai/flows/generate-servant-flow';
import { useAuth } from '@/hooks/use-auth';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Swords, Shield, Wand, ArrowBigUpDash, Sparkles, BookCopy, ShieldPlus, User as UserIcon, Star, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const parameterIcons: { [key: string]: React.ElementType } = {
  Força: Swords,
  Resistência: Shield,
  Agilidade: ArrowBigUpDash,
  Mana: Wand,
  Sorte: Sparkles,
  NP: Star,
};

function ServantSheetSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <Skeleton className="h-80 w-60 rounded-lg" />
                <div className="flex-grow space-y-3 text-center sm:text-left">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-6 w-32" />
                    <div className="grid grid-cols-3 gap-2 mt-4">
                       {[...Array(6)].map((_,i) => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                </div>
            </div>
             <Skeleton className="h-8 w-1/3 mt-4" />
             <Skeleton className="h-20 w-full" />
             <Skeleton className="h-8 w-1/4 mt-4" />
             <Skeleton className="h-24 w-full" />
        </div>
    )
}

export default function CharacterSheetPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, character, saveCharacter, loading: authLoading } = useAuth();
  
  const [isGenerating, setIsGenerating] = useState(false);

  const summonServant = useCallback(async (catalyst: GenerateServantInput) => {
    if (!user) return;
    setIsGenerating(true);

    try {
        const servantData = await generateServant(catalyst);
        
        const newCharacterState: Character = {
          id: user.uid,
          name: catalyst.masterName,
          level: 1,
          servant: servantData,
        };
        
        await saveCharacter(newCharacterState);

        localStorage.setItem(`servant_data_${user.uid}`, JSON.stringify(servantData));
        localStorage.removeItem(`summoning_catalyst_${user.uid}`);
        toast({ title: "Invocação Completa!", description: `${servantData.trueName}, classe ${servantData.className}, respondeu ao seu chamado.`});

    } catch (e) {
        console.error("Failed to summon Servant", e);
        toast({ title: "Falha no Ritual", description: "O Santo Graal não respondeu. Tente refinar seu encantamento.", variant: 'destructive'})
        router.push('/dashboard/character/create');
    } finally {
        setIsGenerating(false);
    }
  }, [user, saveCharacter, router, toast]);
  
  useEffect(() => {
    if (authLoading || !user) return;

    // If character data exists and has a servant, we are good.
    if (character && character.servant) {
        return;
    }
    
    // If there is no character or servant, we need to summon one.
    const catalystData = localStorage.getItem(`summoning_catalyst_${user.uid}`);
    if (catalystData) {
        const parsedCatalyst: GenerateServantInput = JSON.parse(catalystData);
        summonServant(parsedCatalyst);
    } else if (!isGenerating) {
        // No character and no catalyst, user should go back to create.
        router.push('/dashboard/character/create');
    }

  }, [user, character, authLoading, isGenerating, router, summonServant]);

  if (authLoading || isGenerating || !character || !character.servant) {
      return (
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto max-w-4xl">
                 <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2 text-primary">
                            <Sparkles className="size-6 animate-pulse" />
                            <CardTitle className="font-headline text-2xl">O Ritual Está em Andamento...</CardTitle>
                        </div>
                        <CardDescription>O Graal busca um Espírito Heroico que ressoa com a sua alma. Aguarde.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ServantSheetSkeleton />
                    </CardContent>
                </Card>
            </div>
        </main>
      )
  }
  
  const { servant } = character;

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-5xl">
        <>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-primary">{servant.className}: {servant.trueName}</h1>
                    <p className="text-muted-foreground">Servo de {character.name}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push('/dashboard/character/create')}>
                       <ShieldPlus className="mr-2" /> Iniciar Novo Ritual
                    </Button>
                </div>
            </div>
        
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Image, Master, Parameters */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="overflow-hidden">
                        <div className="relative h-96 w-full">
                            <Image src={servant.imageUrl} alt={servant.trueName} fill className="object-cover object-top" data-ai-hint={servant.imageHint} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-4 left-4">
                                <h2 className="font-headline text-3xl text-white">{servant.className}</h2>
                                <p className="text-amber-200 text-sm">{servant.trueName}</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle className="flex items-center gap-2"><UserIcon /> Mestre</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-lg font-bold">{character.name}</p>
                            <p className="text-sm text-muted-foreground">Nível: {character.level}</p>
                        </CardContent>
                    </Card>
                     
                     <Card>
                        <CardHeader><CardTitle>Parâmetros</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-3 gap-2">
                            {servant.parameters.map(param => {
                                const Icon = parameterIcons[param.name] || Star;
                                return (
                                <div key={param.name} className="flex flex-col items-center justify-center p-2 rounded-md bg-secondary/50">
                                    <Icon className="size-5 text-primary mb-1" />
                                    <p className="text-xs text-muted-foreground">{param.name}</p>
                                    <p className="text-lg font-bold">{param.rank}</p>
                                </div>
                            )})}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Fantasma Nobre</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            <h3 className="font-bold text-primary text-xl">{servant.noblePhantasm.name}</h3>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                                <span>Rank: <Badge variant="secondary">{servant.noblePhantasm.rank}</Badge></span>
                                <span>Tipo: <Badge variant="secondary">{servant.noblePhantasm.type}</Badge></span>
                            </div>
                            <p className="text-foreground/80 pt-2">{servant.noblePhantasm.description}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Lenda do Espírito Heroico</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                           <div>
                             <h4 className="font-semibold mb-2">História</h4>
                             <p className="text-muted-foreground whitespace-pre-wrap text-sm">{servant.backstory}</p>
                           </div>
                           <div>
                             <h4 className="font-semibold mb-2">Personalidade</h4>
                             <p className="text-muted-foreground whitespace-pre-wrap text-sm">{servant.personality}</p>
                           </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Habilidades</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-2 border-b pb-1">Habilidades de Classe</h4>
                                <div className="space-y-3 mt-2">
                                {servant.classSkills.map(skill => (
                                    <div key={skill.name}>
                                        <p className="font-bold text-sm">{skill.name} <span className="text-primary">({skill.rank})</span></p>
                                        <p className="text-xs text-muted-foreground">{skill.description}</p>
                                    </div>
                                ))}
                                </div>
                            </div>
                             <div>
                                <h4 className="font-semibold mb-2 border-b pb-1">Habilidades Pessoais</h4>
                                <div className="space-y-3 mt-2">
                                {servant.personalSkills.map(skill => (
                                    <div key={skill.name}>
                                        <p className="font-bold text-sm">{skill.name} <span className="text-primary">({skill.rank})</span></p>
                                        <p className="text-xs text-muted-foreground">{skill.description}</p>
                                    </div>
                                ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
      </div>
    </main>
  );
}
