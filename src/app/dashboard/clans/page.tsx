
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Clan } from '@/lib/game-data';
import { Users, UserPlus, PlusCircle } from 'lucide-react';
import { ClanForm } from '@/components/admin/forms/clan-form';
import { getCollection, addDocument } from '@/services/firestore';
import { useToast } from '@/hooks/use-toast';

export default function ClansPage() {
  const [clans, setClans] = useState<Clan[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchClans() {
      try {
        setLoading(true);
        const clansFromDb = await getCollection<Clan>('clans');
        setClans(clansFromDb);
      } catch (error) {
        console.error("Failed to fetch clans:", error);
        toast({
          title: "Erro ao carregar clãs",
          description: "Não foi possível buscar os dados dos clãs.",
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchClans();
  }, [toast]);


  const handleJoinClan = (clanId: string) => {
    alert(`Pedido para entrar no clã ${clanId} enviado! (funcionalidade simulada)`);
  };

  const handleSaveClan = async (newClanData: Omit<Clan, 'id' | 'members'>) => {
    try {
      const newClan: Omit<Clan, 'id'> = {
        ...newClanData,
        members: [], // Placeholder for the creator
      };
      const newId = await addDocument('clans', newClan);
      setClans(prevClans => [...prevClans, { ...newClan, id: newId }]);
      toast({title: "Clã criado com sucesso!"});
    } catch(e) {
      toast({title: "Erro ao criar clã", variant: "destructive"});
    }
    setIsCreateDialogOpen(false);
  };
  
  if (loading) {
    return <div className="p-8 text-center">Carregando clãs...</div>;
  }

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

    