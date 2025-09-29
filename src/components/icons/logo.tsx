import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="font-headline text-2xl font-bold text-primary transition-opacity hover:opacity-80">
      Mundo Mítico
    </Link>
  );
}
