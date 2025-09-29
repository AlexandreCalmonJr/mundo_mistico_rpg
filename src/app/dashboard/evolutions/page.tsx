
'use client'

import { useState, useEffect } from 'react';
import { getCollection } from '@/services/firestore';
import type { GameClass, ClassGroup, Ability, Mythology } from '@/lib/game-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, GitMerge, Shield, Star, Swords } from 'lucide-react';

export default function EvolutionsPage() {
    const [mythologies, setMythologies] = useState<Mythology[]>([]);
    const [gameClasses, setGameClasses] = useState<GameClass[]>([]);
    const [classGroups, setClassGroups] = useState<ClassGroup[]>([]);
    const [abilities, setAbilities] = useState<Ability[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [mythologiesData, classesData, groupsData, abilitiesData] = await Promise.all([
                    getCollection<Mythology>('mythologies'),
                    getCollection<GameClass>('classes'),
                    getCollection<ClassGroup>('classGroups'),
                    getCollection<Ability>('abilities'),
                ]);
                setMythologies(mythologiesData);
                setGameClasses(classesData);
                setClassGroups(groupsData);
                setAbilities(abilitiesData);
            } catch (error) {
                console.error("Failed to fetch evolution data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const abilityIcons = {
        'Ataque': <Swords className="size-4" />,
        'Defesa': <Shield className="size-4" />,
        'Suporte': <Star className="size-4" />,
        'Utilidade': <GitMerge className="size-4" />,
    }

    if (loading) {
        return <div className="p-8">Carregando árvores de classes...</div>
    }

    return (
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto">
                <h1 className="text-3xl font-headline font-bold text-primary mb-2">Árvores de Classes e Habilidades</h1>
                <p className="text-muted-foreground mb-8">Explore os caminhos de evolução e as habilidades únicas de cada classe.</p>

                <Accordion type="single" collapsible className="w-full">
                    {mythologies.map(mythology => {
                        const baseClasses = gameClasses.filter(c => c.mythology === mythology.id);
                        if(baseClasses.length === 0) return null;

                        return (
                             <AccordionItem value={mythology.id} key={mythology.id}>
                                <AccordionTrigger className="text-xl font-headline hover:no-underline">
                                    {mythology.name}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
                                        {baseClasses.map(baseClass => {
                                            const evolutions = classGroups.filter(cg => cg.baseClassId === baseClass.id);
                                            const classAbilities = abilities.filter(a => a.classId === baseClass.id);

                                            return (
                                                <Card key={baseClass.id}>
                                                    <CardHeader>
                                                        <CardTitle className="font-headline">{baseClass.name}</CardTitle>
                                                        <CardDescription>Classe Base</CardDescription>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div>
                                                            <h4 className="font-semibold text-sm mb-2">Habilidades da Classe:</h4>
                                                             <div className="space-y-2">
                                                                {classAbilities.length > 0 ? classAbilities.map(ability => (
                                                                     <div key={ability.id} className="p-2 rounded-md bg-secondary/50 text-xs">
                                                                        <div className="flex justify-between items-center font-bold">
                                                                            <span className="flex items-center gap-2">{abilityIcons[ability.type]} {ability.name}</span>
                                                                            <span>Nível {ability.levelRequirement}</span>
                                                                        </div>
                                                                        <p className="text-muted-foreground mt-1">{ability.description}</p>
                                                                     </div>
                                                                )) : <p className="text-xs text-muted-foreground">Nenhuma habilidade específica.</p>}
                                                            </div>
                                                        </div>

                                                        {evolutions.length > 0 && (
                                                            <div>
                                                                <h4 className="font-semibold text-sm mb-2">Evoluções:</h4>
                                                                <div className="space-y-3">
                                                                    {evolutions.map(evo => (
                                                                        <div key={evo.id} className="flex items-center gap-2 text-sm">
                                                                            <ArrowRight className="size-4 text-primary"/>
                                                                            <span className="font-semibold">{evo.name}</span>
                                                                            <Badge variant="outline">Nível {evo.levelRequirement}</Badge>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )
                    })}
                </Accordion>
            </div>
        </main>
    )
}

