import Link from "next/link";
import { Sparkles } from 'lucide-react';

export function Logo() {
  return (
     <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold text-primary transition-opacity hover:opacity-80">
        <div className="bg-primary/10 p-2 rounded-md">
            <Sparkles className="text-primary" />
        </div>
      Mundo Mítico
    </Link>
  );
}
