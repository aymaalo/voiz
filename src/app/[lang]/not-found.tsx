import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <Logo className="h-16 w-auto text-ivoire" />
      <p className="m-0 font-serif text-[clamp(28px,6vw,52px)] text-orange italic">
        404 · page introuvable
      </p>
      <p className="m-0 max-w-[420px] text-[15px] text-muted">
        Cette page n’existe pas (ou plus). · This page could not be found.
      </p>
      <Link
        href="/fr"
        className="rounded-full bg-orange px-8 py-4 text-[13px] font-bold tracking-[.1em] text-noir uppercase transition-colors hover:bg-ivoire"
      >
        Accueil · Home
      </Link>
    </main>
  );
}
