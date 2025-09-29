import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-headline font-bold text-accent mb-2">Painel de Administração</h1>
        <p className="text-muted-foreground mb-8">Bem-vindo, mestre do jogo. Aqui você controla o universo.</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Usuários</CardTitle>
              <CardDescription>Visualizar e editar jogadores.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Em breve...</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Conteúdo do Jogo</CardTitle>
              <CardDescription>Editar classes, raças e templos.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Em breve...</p>
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Ajustar parâmetros globais do jogo.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Em breve...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
