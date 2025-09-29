
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { clans as initialClans } from '@/lib/game-data';
import type { Clan } from '@/lib/game-data';
import { Users, UserPlus, PlusCircle } from 'lucide-react';
import { ClanForm } from '@/components/admin/forms/clan-form';


export default function ClansPage() {
  const [clans, setClans] = useState<Clan[]>(initialClans);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleJoinClan = (clanId: string) => {
    alert(`Pedido para entrar no clã ${clanId} enviado! (funcionalidade simulada)`);
  };

  const handleSaveClan = (newClanData: Omit<Clan, 'id' | 'members'>) => {
    const newClan: Clan = {
      ...newClanData,
      id: `clan-${Date.now()}`,
      members: ['Criador'], // Placeholder for the creator
    };
    setClans(prevClans => [...prevClans, newClan]);
    setIsCreateDialogOpen(false);
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-headline font-bold text-primary mb-2">Clãs do Mundo Mítico</h1>
                <p className="text-muted-foreground">Encontre aliados, junte-se a uma guilda e conquiste desafios em equipe.</p>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar Novo Clã
            </Button>
        </div>


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
      
      <ClanForm 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleSaveClan}
        defaultValues={null}
      />

    </main>
  );
}
