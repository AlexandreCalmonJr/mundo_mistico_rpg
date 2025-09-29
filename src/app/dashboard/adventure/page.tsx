'use client';

import { useState, useEffect } from 'react';
import { MapSelection } from '@/components/adventure/map-selection';
import { ChatInterface } from '@/components/adventure/chat-interface';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldPlus } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import type { GameMap } from '@/lib/game-data';

export default function AdventurePage() {
  const [selectedMap, setSelectedMap] = useState<GameMap | null>(null);
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
          <main className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
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
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full mt-4" />
        </div>
    );
  }
  
  if (!selectedMap) {
    return <MapSelection onMapSelect={setSelectedMap} />;
  }

  return <ChatInterface gameMap={selectedMap} />;
}
