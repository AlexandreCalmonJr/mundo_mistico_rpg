'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { gameClasses, races, mythologies } from '@/lib/game-data';
import type { Character } from '@/lib/game-data';
import { generateCharacterSheet, GenerateCharacterSheetOutput } from '@/ai/flows/generate-character-sheet';
import { PlaceHolderImages } from '@/lib/placeholder-images';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Swords, Shield, Wand, ArrowBigUpDash, Sparkles, BookCopy, ShieldPlus } from 'lucide-react';

const attributeIcons: { [key: string]: React.ElementType } = {
  Força: Swords,
  Agilidade: ArrowBigUpDash,
  Inteligência: Wand,
  Defesa: Shield,
};

function CharacterSheetSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <Skeleton className="size-32 rounded-lg" />
                <div className="flex-grow space-y-2 text-center sm:text-left">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-24" />
                </div>
            </div>
             <Skeleton className="h-8 w-1/3" />
             <Skeleton className="h-20 w-full" />
             <Skeleton className="h-8 w-1/4 mt-4" />
             <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
             </div>
        </div>
    )
}

export default function CharacterSheetPage() {
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [sheet, setSheet] = useState<GenerateCharacterSheetOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const charData = localStorage.getItem('character');
    if (!charData) {
      router.push('/dashboard/character/create');
      return;
    }
    const parsedChar: Character = JSON.parse(charData);
    setCharacter(parsedChar);

    const generateSheet = async () => {
        const raceInfo = races.find(r => r.id === parsedChar.race);
        const classInfo = gameClasses.find(c => c.id === parsedChar.gameClass);
        const mythologyInfo = mythologies.find(m => m.id === parsedChar.mythology);

        if (raceInfo && classInfo && mythologyInfo) {
            const result = await generateCharacterSheet({
                characterName: parsedChar.name,
                characterMythology: mythologyInfo.name,
                characterRace: raceInfo.name,
                characterClass: classInfo.name,
                classStrengths: classInfo.strengths,
                classWeaknesses: classInfo.weaknesses,
            });
            setSheet(result);
        }
        setLoading(false);
    }

    generateSheet();
  }, [router]);

  if (!character) {
    return null; 
  }
  
  const raceInfo = races.find(r => r.id === character.race);
  const classInfo = gameClasses.find(c => c.id === character.gameClass);
  const mythologyInfo = mythologies.find(m => m.id === character.mythology);
  const avatar = PlaceHolderImages.find(p => p.id === `${character.race}-race`);

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        {loading || !sheet ? (
            <Card>
                <CardHeader>
                     <div className="flex items-center gap-2 text-primary">
                        <Sparkles className="size-6 animate-pulse" />
                        <CardTitle className="font-headline text-2xl">Gerando sua Lenda...</CardTitle>
                    </div>
                    <CardDescription>Aguarde enquanto a IA forja os detalhes épicos do seu personagem.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CharacterSheetSkeleton />
                </CardContent>
            </Card>
        ) : (
            <>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-headline font-bold text-primary">{character.name}</h1>
                        <p className="text-muted-foreground">{raceInfo?.name} {classInfo?.name} de {mythologyInfo?.name} - Nível {character.level}</p>
                    </div>
                    <Button variant="outline" onClick={() => router.push('/dashboard/character/create')}>
                       <ShieldPlus className="mr-2" /> Criar Novo
                    </Button>
                </div>
            
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-6">
                         {avatar && (
                            <Card className="overflow-hidden">
                                <div className="relative h-80 w-full">
                                    <Image src={avatar.imageUrl} alt={avatar.description} fill className="object-cover" data-ai-hint={avatar.imageHint} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <h2 className="absolute bottom-4 left-4 font-headline text-3xl text-white">{character.name}</h2>
                                </div>
                            </Card>
                         )}

                         <Card>
                             <CardHeader><CardTitle>Equipamento</CardTitle></CardHeader>
                             <CardContent className="space-y-2">
                                {sheet.suggestedEquipment.map(equip => (
                                    <p key={equip.name} className="text-sm"><span className="font-semibold">{equip.name}:</span> {equip.description}</p>
                                ))}
                             </CardContent>
                         </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <BookCopy className="text-primary" />
                                    <CardTitle>História</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground whitespace-pre-wrap">{sheet.backstory}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Atributos</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 gap-4">
                                {sheet.attributes.map(attr => {
                                    const Icon = attributeIcons[attr.name] || Shield;
                                    return (
                                        <div key={attr.name}>
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2">
                                                    <Icon className="text-primary" />
                                                    <span className="font-semibold">{attr.name}</span>
                                                </div>
                                                <span className="text-sm font-bold">{attr.value}</span>
                                            </div>
                                            <Progress value={attr.value} />
                                        </div>
                                    )
                                })}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle>Habilidades Iniciais</CardTitle></CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {sheet.initialAbilities.map(ability => (
                                        <Badge key={ability} variant="secondary">{ability}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </>
        )}
      </div>
    </main>
  );
}
