
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Logo } from '@/components/icons/logo';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-background');

  return (
    <div className="relative flex flex-col min-h-screen w-full">
      <div className="absolute inset-0">
        {heroImage && (
            <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
            />
        )}
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      </div>


      <header className="relative z-10 p-4 sm:p-6">
        <div className="container mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Criar Conta</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-grow items-center justify-center">
        <div className="container mx-auto flex flex-col items-center text-center px-4">
          <h1 className="font-headline text-5xl md:text-7xl font-bold text-primary animate-fade-in-down">
            Mundo Mítico
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-foreground/80 animate-fade-in-up">
            Forje sua lenda em um RPG online onde suas escolhas moldam a história. Enfrente desafios míticos, resolva enigmas ancestrais e torne-se um herói.
          </p>
          <div className="mt-8 flex gap-4 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <Button asChild size="lg">
              <Link href="/signup">Comece sua Jornada</Link>
            </Button>
          </div>
        </div>
      </main>

       <footer className="relative z-10 p-4 text-center text-xs text-muted-foreground">
          <Link href="/admin-login" className="underline hover:text-primary">
            Acesso para Administradores
          </Link>
      </footer>
    </div>
  );
}
