
'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { gameClasses, races, mythologies } from '@/lib/game-data';
import type { Character, Attribute } from '@/lib/game-data';
import { generateCharacterSheet, GenerateCharacterSheetOutput } from '@/ai/flows/generate-character-sheet';
import { PlaceHolderImages } from '@/lib/placeholder-images';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Swords, Shield, Wand, ArrowBigUpDash, Sparkles, BookCopy, ShieldPlus, PlusCircle, ArrowUpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

const POINTS_PER_LEVEL = 5;

export default function CharacterSheetPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [character, setCharacter] = useState<Character | null>(null);
  const [sheet, setSheet] = useState<Pick<GenerateCharacterSheetOutput, 'backstory' | 'suggestedEquipment' | 'initialAbilities'> | null>(null);
  const [loading, setLoading] = useState(true);

  const saveCharacter = (char: Character) => {
    localStorage.setItem('character', JSON.stringify(char));
    setCharacter(char);
  };

  const handleLevelUp = useCallback(() => {
    if (!character) return;
    
    const newLevel = character.level + 1;
    const newAttributePoints = character.attributePoints + POINTS_PER_LEVEL;
    const newXpToNextLevel = Math.floor(character.xpToNextLevel * 1.5);

    const updatedCharacter: Character = {
        ...character,
        level: newLevel,
        xp: 0,
        xpToNextLevel: newXpToNextLevel,
        attributePoints: newAttributePoints,
    };
    saveCharacter(updatedCharacter);
    toast({
        title: "Você subiu de nível!",
        description: `Você alcançou o nível ${newLevel} e ganhou ${POINTS_PER_LEVEL} pontos de atributo!`,
    });
  }, [character, toast]);

  const handleGainXp = () => {
    if (!character) return;
    const xpGained = Math.floor(character.xpToNextLevel / 3);
    const newXp = character.xp + xpGained;

    if (newXp >= character.xpToNextLevel) {
        handleLevelUp();
    } else {
        const updatedCharacter = { ...character, xp: newXp };
        saveCharacter(updatedCharacter);
        toast({ title: `Você ganhou ${xpGained} XP!` });
    }
  }

  useEffect(() => {
    const charData = localStorage.getItem('character');
    if (!charData) {
      router.push('/dashboard/character/create');
      return;
    }
    
    const parsedChar: Character = JSON.parse(charData);
    
    const loadSheet = async () => {
      // Check if the character already has attributes. If so, they have been generated.
      if (parsedChar.attributes && parsedChar.attributes.length > 0) {
        setCharacter(parsedChar);
        // If we have a backstory, we assume the rest of the sheet is generated.
        // This is a simplification to avoid re-generating the sheet on every visit.
        const backstory = localStorage.getItem(`char_backstory_${parsedChar.id}`);
        const equipment = localStorage.getItem(`char_equipment_${parsedChar.id}`);
        const abilities = localStorage.getItem(`char_abilities_${parsedChar.id}`);
        
        if(backstory && equipment && abilities) {
            setSheet({
                backstory,
                suggestedEquipment: JSON.parse(equipment),
                initialAbilities: JSON.parse(abilities),
            });
            setLoading(false);
            return;
        }
      }

      // If not, generate the character sheet
      const raceInfo = races.find(r => r.id === parsedChar.race);
      const classInfo = gameClasses.find(c => c.id === parsedChar.gameClass);
      const mythologyInfo = mythologies.find(m => m.id === parsedChar.mythology);

      if (raceInfo && classInfo && mythologyInfo) {
          try {
            const result = await generateCharacterSheet({
                characterName: parsedChar.name,
                characterMythology: mythologyInfo.name,
                characterRace: raceInfo.name,
                characterClass: classInfo.name,
                classStrengths: classInfo.strengths,
                classWeaknesses: classInfo.weaknesses,
            });

            const newCharacter: Character = {
              ...parsedChar,
              attributes: result.attributes,
              level: 1,
              xp: 0,
              xpToNextLevel: 100,
              attributePoints: 5,
            };
            
            saveCharacter(newCharacter);
            setSheet(result);

            // Save AI generated text to local storage to avoid re-generation
            localStorage.setItem(`char_backstory_${newCharacter.id}`, result.backstory);
            localStorage.setItem(`char_equipment_${newCharacter.id}`, JSON.stringify(result.suggestedEquipment));
            localStorage.setItem(`char_abilities_${newCharacter.id}`, JSON.stringify(result.initialAbilities));
          } catch(e) {
            console.error("Failed to generate character sheet", e);
            toast({ title: "Erro de IA", description: "Não foi possível gerar a ficha do personagem. Tente novamente.", variant: 'destructive'})
            router.push('/dashboard/character/create');
          } finally {
            setLoading(false);
          }
      } else {
        setLoading(false);
      }
    }

    loadSheet();
  }, [router, toast]);


  const handleAttributeIncrease = (attributeName: string) => {
    if (character && character.attributePoints > 0) {
        const newAttributes = character.attributes.map(attr => 
            attr.name === attributeName ? { ...attr, value: attr.value + 1 } : attr
        );
        const updatedCharacter = {
            ...character,
            attributes: newAttributes,
            attributePoints: character.attributePoints - 1,
        };
        saveCharacter(updatedCharacter);
    }
  };


  if (loading || !character || !sheet) {
      return (
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto max-w-4xl">
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
            </div>
        </main>
      )
  }
  
  const raceInfo = races.find(r => r.id === character.race);
  const classInfo = gameClasses.find(c => c.id === character.gameClass);
  const mythologyInfo = mythologies.find(m => m.id === character.mythology);
  const avatar = PlaceHolderImages.find(p => p.id === `${raceInfo?.image}`);

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl">
        <>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-3xl font-headline font-bold text-primary">{character.name}</h1>
                    <p className="text-muted-foreground">{raceInfo?.name} {classInfo?.name} de {mythologyInfo?.name}</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleGainXp} variant="outline"><ArrowUpCircle className="mr-2"/> Ganhar XP</Button>
                    <Button variant="outline" onClick={() => router.push('/dashboard/character/create')}>
                       <ShieldPlus className="mr-2" /> Criar Novo
                    </Button>
                </div>
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
                        <CardHeader>
                            <CardTitle>Progressão</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex justify-between items-baseline">
                                     <p className="font-bold">Nível {character.level}</p>
                                     <p className="text-sm text-muted-foreground">{character.xp} / {character.xpToNextLevel} XP</p>
                                </div>
                                <Progress value={(character.xp / character.xpToNextLevel) * 100} className="mt-1"/>
                            </div>
                            <div>
                                <p className="font-bold">Pontos de Atributo</p>
                                <p className="text-2xl text-primary font-bold">{character.attributePoints}</p>
                                <p className="text-xs text-muted-foreground">Use-os para melhorar seus atributos.</p>
                            </div>
                        </CardContent>
                     </Card>

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
                        <CardHeader>
                            <CardTitle>Atributos</CardTitle>
                            {character.attributePoints > 0 && <CardDescription>Você tem {character.attributePoints} ponto(s) para distribuir!</CardDescription>}
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            {character.attributes.map(attr => {
                                const Icon = attributeIcons[attr.name] || Shield;
                                return (
                                    <div key={attr.name}>
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <Icon className="text-primary" />
                                                <span className="font-semibold">{attr.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold w-8 text-center">{attr.value}</span>
                                                <Button 
                                                    size="icon" 
                                                    variant="outline" 
                                                    className="h-7 w-7"
                                                    onClick={() => handleAttributeIncrease(attr.name)}
                                                    disabled={character.attributePoints === 0}
                                                >
                                                    <PlusCircle className="size-4"/>
                                                </Button>
                                            </div>
                                        </div>
                                        <Progress value={attr.value} max={100} />
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
      </div>
    </main>
  );
}
