
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mythologies } from '@/lib/game-data';
import type { GameClass, Race, Character } from '@/lib/game-data';
import { getCollection } from '@/services/firestore';
import { Sparkles } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const formSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.').max(50, 'O nome deve ter no máximo 50 caracteres.'),
  mythology: z.string({ required_error: 'Por favor, selecione uma mitologia.' }),
  race: z.string({ required_error: 'Por favor, selecione uma raça.' }),
  gameClass: z.string({ required_error: 'Por favor, selecione uma classe.' }),
});

export default function CharacterCreationPage() {
  const router = useRouter();
  const [gameClasses, setGameClasses] = useState<GameClass[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [classesData, racesData] = await Promise.all([
          getCollection<GameClass>('classes'),
          getCollection<Race>('races'),
        ]);
        setGameClasses(classesData);
        setRaces(racesData);
      } catch (error) {
        console.error("Failed to fetch creation data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const selectedMythology = form.watch('mythology');

  const availableRaces = races.filter(r => r.mythology === selectedMythology);
  const availableClasses = gameClasses.filter(gc => gc.mythology === selectedMythology);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const character: Omit<Character, 'level' | 'attributes' | 'xp' | 'xpToNextLevel' | 'attributePoints'> & { level?: number } = {
        id: `char-${Date.now()}`,
        ...values,
    }
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('char_')) {
            localStorage.removeItem(key);
        }
    });

    localStorage.setItem('character', JSON.stringify(character));
    router.push('/dashboard/character/sheet');
  }

  if (loading) {
    return (
      <main className="p-4 sm:p-6 lg:p-8"><div className="container mx-auto max-w-2xl space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-8 w-3/4" />
        <Card><CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader><CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent></Card>
      </div></main>
    )
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">Criação de Personagem</h1>
        <p className="text-muted-foreground mb-8">Dê vida ao seu herói. Escolha sua origem, raça e classe para começar.</p>

        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Personagem</CardTitle>
            <CardDescription>Cada escolha molda o início da sua jornada.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Personagem</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do seu herói" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mythology"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Panteão Mitológico</FormLabel>
                       <Select onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue('race', '');
                          form.setValue('gameClass', '');
                       }} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione sua origem mitológica" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mythologies.map((myth) => (
                            <SelectItem key={myth.id} value={myth.id}>{myth.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                       <FormDescription>A escolha do panteão define as raças e classes disponíveis.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="race"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Raça</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!selectedMythology}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma raça" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableRaces.map((race) => (
                            <SelectItem key={race.id} value={race.id}>{race.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gameClass"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Classe</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!selectedMythology}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma classe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableClasses.map((gClass) => (
                            <SelectItem key={gClass.id} value={gClass.id}>{gClass.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Forjar Personagem
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

    