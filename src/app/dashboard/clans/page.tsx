
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { clans as initialClans } from '@/lib/game-data';
import type { Clan } from '@/lib/game-data';
import { Users, UserPlus } from 'lucide-react';

export default function ClansPage() {
  const [clans, setClans] = useState<Clan[]>(initialClans);

  // Função de placeholder, já que não há sistema de usuário real
  const handleJoinClan = (clanId: string) => {
    alert(`Pedido para entrar no clã ${clanId} enviado! (funcionalidade simulada)`);
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">Clãs do Mundo Mítico</h1>
        <p className="text-muted-foreground mb-8">Encontre aliados, junte-se a uma guilda e conquiste desafios em equipe.</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clans.map((clan) => (
            <Card key={clan.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="font-headline">{clan.name}</CardTitle>
                    <Badge variant="secondary" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {clan.members.length}
                    </Badge>
                </div>
                <CardDescription>{clan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <h4 className="font-semibold text-sm">Membros Notáveis</h4>
                <div className="flex flex-wrap gap-2">
                    {clan.members.map(member => (
                        <Badge key={member} variant="outline">{member}</Badge>
                    ))}
                </div>
              </CardContent>
              <CardFooter>
                 <Button className="w-full" onClick={() => handleJoinClan(clan.id)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Juntar-se ao Clã
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
