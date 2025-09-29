'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { gameClasses, races } from '@/lib/game-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ShieldPlus, Sparkles, PartyPopper } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.').max(50, 'O nome deve ter no máximo 50 caracteres.'),
  race: z.string({ required_error: 'Por favor, selecione uma raça.' }),
  gameClass: z.string({ required_error: 'Por favor, selecione uma classe.' }),
});

export default function CharacterCreationPage() {
  const [character, setCharacter] = useState<{ name: string; race: string; gameClass: string } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setCharacter(values);
  }

  const charImage = PlaceHolderImages.find((img) => img.id === 'character-creation');

  if (character) {
    const selectedRace = races.find(r => r.id === character.race);
    const selectedClass = gameClasses.find(c => c.id === character.gameClass);

    return (
        <main className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-full">
            <Card className="w-full max-w-md text-center animate-fade-in-up">
                <CardHeader>
                    <div className="mx-auto bg-green-500/10 p-3 rounded-full mb-4 w-fit">
                        <PartyPopper className="size-8 text-green-400" />
                    </div>
                    <CardTitle className="text-3xl font-headline text-primary">Personagem Criado!</CardTitle>
                    <CardDescription>Sua lenda, {character.name}, está pronta para a aventura.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    {charImage && (
                        <div className="relative h-64 w-48 rounded-lg overflow-hidden mb-4 border border-border">
                            <Image
                                src={charImage.imageUrl}
                                alt={character.name}
                                fill
                                className="object-cover"
                                data-ai-hint={charImage.imageHint}
                            />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                             <p className="absolute bottom-2 left-2 right-2 font-bold text-white text-lg">{character.name}</p>
                        </div>
                    )}
                    <p className="text-lg font-semibold">{selectedRace?.name} {selectedClass?.name}</p>
                    <p className="text-sm text-muted-foreground mt-2">Este é um placeholder para o GIF do seu personagem, que seria obtido de uma API como xivapi.com.</p>
                    <div className="flex gap-4 mt-6">
                        <Button onClick={() => setCharacter(null)}>
                            <ShieldPlus className="mr-2 h-4 w-4" />
                            Criar Outro
                        </Button>
                         <Button asChild>
                            <Link href="/dashboard/adventure">
                                <Sparkles className="mr-2 h-4 w-4" />
                                Iniciar Aventura
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">Criação de Personagem</h1>
        <p className="text-muted-foreground mb-8">Dê vida ao seu herói. Escolha seu nome, raça e classe para começar.</p>

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
                  name="race"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Raça</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma raça" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {races.map((race) => (
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma classe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {gameClasses.map((gClass) => (
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
