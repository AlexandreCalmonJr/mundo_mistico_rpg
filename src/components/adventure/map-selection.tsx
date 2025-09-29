import type { GameMap } from '@/lib/game-data';
import { gameMaps } from '@/lib/game-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MapSelectionProps {
  onMapSelect: (map: GameMap) => void;
}

export function MapSelection({ onMapSelect }: MapSelectionProps) {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">Escolha sua Aventura</h1>
        <p className="text-muted-foreground mb-8">
          Locais antigos guardam tesouros e segredos. Qual caminho você trilhará?
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gameMaps.map((map) => (
            <Card key={map.type} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline">{map.name}</CardTitle>
                <CardDescription>{map.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button className="w-full" onClick={() => onMapSelect(map)}>
                  Explorar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
