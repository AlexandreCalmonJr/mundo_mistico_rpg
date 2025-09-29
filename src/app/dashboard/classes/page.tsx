
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { GameClass, Race } from '@/lib/game-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { getCollection } from '@/services/firestore';
import { Skeleton } from '@/components/ui/skeleton';

function PageSkeleton() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-headline font-semibold mb-4 border-b border-border pb-2">Classes</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-headline font-semibold mb-4 border-b border-border pb-2">Raças</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
      </section>
    </div>
  )
}

export default function ClassesPage() {
  const [gameClasses, setGameClasses] = useState<GameClass[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);

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
        console.error("Failed to fetch page data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">Classes e Raças</h1>
        <p className="text-muted-foreground mb-8">Conheça os arquétipos e povos que habitam o Mundo Mítico.</p>

        {loading ? <PageSkeleton /> : (
          <>
            <section>
              <h2 className="text-2xl font-headline font-semibold mb-4 border-b border-border pb-2">Classes</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {gameClasses.map((gClass) => {
                  const image = PlaceHolderImages.find(p => p.id === gClass.image);
                  return (
                    <Card key={gClass.id} className="overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10">
                      {image && (
                        <div className="relative h-48 w-full">
                          <Image
                            src={image.imageUrl}
                            alt={gClass.name}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="font-headline">{gClass.name}</CardTitle>
                        <CardDescription>{gClass.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Pontos Fortes</h4>
                          <div className="flex flex-wrap gap-2">
                            {gClass.strengths.map((strength) => (
                              <Badge key={strength} variant="secondary" className='bg-green-500/10 text-green-300'>{strength}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Pontos Fracos</h4>
                          <div className="flex flex-wrap gap-2">
                            {gClass.weaknesses.map((weakness) => (
                              <Badge key={weakness} variant="destructive" className="bg-red-500/10 text-red-300">{weakness}</Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-2xl font-headline font-semibold mb-4 border-b border-border pb-2">Raças</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {races.map((race) => {
                  const image = PlaceHolderImages.find(p => p.id === race.image);
                  return (
                    <Card key={race.id} className="overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10">
                      {image && (
                        <div className="relative h-40 w-full">
                          <Image
                            src={image.imageUrl}
                            alt={race.name}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="font-headline">{race.name}</CardTitle>
                        <CardDescription>{race.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

    