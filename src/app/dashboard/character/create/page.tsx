
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const formSchema = z.object({
  masterName: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.').max(50, 'O nome deve ter no máximo 50 caracteres.'),
  masterDescription: z.string().min(50, 'Descreva seus ideais em pelo menos 50 caracteres.').max(1000, 'A descrição deve ter no máximo 1000 caracteres.'),
});

export default function ServantSummoningPage() {
  const router = useRouter();
  const { user, saveCharacter, character } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      masterName: character?.name || '',
      masterDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
        router.push('/login');
        return;
    }
    
    // Store the catalyst information to be used on the sheet page for summoning
    localStorage.setItem(`summoning_catalyst_${user.uid}`, JSON.stringify(values));

    // Clear any old servant data to ensure a fresh summoning
    localStorage.removeItem(`servant_data_${user.uid}`);
    
    // Save a minimal master profile, this will trigger the redirect and summoning process
    await saveCharacter({
        id: user.uid,
        name: values.masterName,
        level: 1, // All masters start at level 1
        servant: null, // Servant will be summoned on the next page
    });

    router.push('/dashboard/character/sheet');
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">Ritual de Invocação</h1>
        <p className="text-muted-foreground mb-8">O Santo Graal responde não a poder, mas a desejo. Descreva seus ideais, sua alma, e o herói que ecoa seu coração atenderá ao seu chamado.</p>

        <Card>
          <CardHeader>
            <CardTitle>Círculo de Invocação</CardTitle>
            <CardDescription>Suas palavras servirão como catalisador.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="masterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seu Nome de Mestre</FormLabel>
                      <FormControl>
                        <Input placeholder="O nome que será gravado na história" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="masterDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>O Encantamento (Seus Ideais como Catalisador)</FormLabel>
                      <FormControl>
                        <Textarea 
                            placeholder="Ex: 'Busco a justiça acima de tudo, mesmo que o caminho seja solitário. Minha lâmina é para proteger os fracos e meu escudo para resistir à tirania. Não desejo o Graal para mim, mas para criar um mundo onde ninguém precise sofrer como eu sofri...'"
                            {...field} 
                            rows={8}
                        />
                      </FormControl>
                      <FormDescription>Descreva sua personalidade, seus desejos para o Graal e seu estilo de combate. Seja honesto. O Graal está ouvindo.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Começar o Ritual e Invocar Servo
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
