
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
import { getCollection } from '@/services/firestore';
import { useToast } from '@/hooks/use-toast';

export default function AdventurePage() {
  const [selectedMap, setSelectedMap] = useState<GameMap | null>(null);
  const [hasCharacter, setHasCharacter] = useState<boolean | null>(null);
  const [gameMaps, setGameMaps] = useState<GameMap[]>([]);
  const [loadingMaps, setLoadingMaps] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
      const charData = localStorage.getItem('character');
      setHasCharacter(!!charData);
      
      async function fetchMaps() {
        try {
          const mapsFromDb = await getCollection<GameMap>('gameMaps');
          setGameMaps(mapsFromDb);
        } catch(e) {
          console.error("Failed to fetch maps", e);
          toast({ title: "Erro ao buscar mapas", variant: "destructive"});
        } finally {
          setLoadingMaps(false);
        }
      }
      fetchMaps();

  }, [toast]);

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

  if (hasCharacter === null || loadingMaps) {
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <Skeleton className="h-24 w-full" />
            <div className="grid mt-8 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
        </div>
    );
  }
  
  if (!selectedMap) {
    return <MapSelection gameMaps={gameMaps} onMapSelect={setSelectedMap} />;
  }

  return <ChatInterface gameMap={selectedMap} />;
}

    