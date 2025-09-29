'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { gameClasses, races } from '@/lib/game-data';
import { Sparkles } from 'lucide-react';
import type { Character } from '@/lib/game-data';

const formSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.').max(50, 'O nome deve ter no máximo 50 caracteres.'),
  race: z.string({ required_error: 'Por favor, selecione uma raça.' }),
  gameClass: z.string({ required_error: 'Por favor, selecione uma classe.' }),
});

export default function CharacterCreationPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const character: Character = {
        id: `char-${Date.now()}`,
        ...values,
        level: 1,
    }
    localStorage.setItem('character', JSON.stringify(character));
    router.push('/dashboard/character/sheet');
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
