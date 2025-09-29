'use client';

import { useState, useEffect } from 'react';
import { TempleSelection } from '@/components/adventure/temple-selection';
import { ChatInterface } from '@/components/adventure/chat-interface';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldPlus } from 'lucide-react';
import Link from 'next/link';

export type Temple = {
    name: string;
    type: string;
    description: string;
}

export default function AdventurePage() {
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [hasCharacter, setHasCharacter] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
      const charData = localStorage.getItem('character');
      if (!charData) {
          setHasCharacter(false);
      } else {
          setHasCharacter(true);
      }
  }, []);

  if (hasCharacter === false) {
      return (
          <main className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-full">
              <Card className="w-full max-w-md text-center">
                  <CardHeader>
                      <CardTitle className="text-2xl font-headline">Personagem Necessário</CardTitle>
                      <CardDescription>Você precisa criar um personagem antes de iniciar uma aventura.</CardDescription>
                  </CardHeader>
                  <CardContent>
                       <Button asChild>
                          <Link href="/dashboard/character/create">
                              <ShieldPlus className="mr-2 h-4 w-4" />
                              Criar Personagem
                          </Link>
                      </Button>
                  </CardContent>
              </Card>
          </main>
      )
  }

  if (hasCharacter === null) {
    return null; // ou um loader
  }
  
  if (!selectedTemple) {
    return <TempleSelection onTempleSelect={setSelectedTemple} />;
  }

  return <ChatInterface temple={selectedTemple} />;
}
