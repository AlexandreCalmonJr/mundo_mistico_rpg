import type { Temple } from '@/app/dashboard/adventure/page';
import { temples } from '@/lib/game-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TempleSelectionProps {
  onTempleSelect: (temple: Temple) => void;
}

export function TempleSelection({ onTempleSelect }: TempleSelectionProps) {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">Escolha sua Aventura</h1>
        <p className="text-muted-foreground mb-8">
          Antigos templos guardam tesouros e segredos. Qual caminho você trilhará?
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {temples.map((temple) => (
            <Card key={temple.type} className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-headline">{temple.name}</CardTitle>
                <CardDescription>{temple.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button className="w-full" onClick={() => onTempleSelect(temple)}>
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
