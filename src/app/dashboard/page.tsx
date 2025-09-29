import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShieldPlus } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-headline font-bold text-primary mb-2">Painel do Aventureiro</h1>
        <p className="text-muted-foreground mb-8">Sua jornada mítica começa aqui. O que você fará hoje?</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-md">
                  <Users className="size-6 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Meus Personagens</CardTitle>
              </div>
              <CardDescription>Gerencie seus heróis e prepare-os para a batalha.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground mb-4">Você ainda não criou um personagem.</p>
                <Button asChild>
                    <Link href="/dashboard/character/create">
                        <ShieldPlus className="mr-2 h-4 w-4" />
                        Criar Novo Personagem
                    </Link>
                </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col bg-primary/5 border-primary/20">
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Comece uma Nova Aventura</CardTitle>
                <CardDescription>O Mundo Mítico está cheio de mistérios para desvendar.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col items-center justify-center text-center">
                <p className="text-muted-foreground mb-4">Escolha um templo e comece sua exploração.</p>
                <Button asChild variant="default">
                    <Link href="/dashboard/adventure">
                        Explorar Templos
                    </Link>
                </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
