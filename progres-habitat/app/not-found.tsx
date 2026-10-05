import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main id="contenu" className="flex min-h-dvh flex-col items-center justify-center bg-sand-50 px-6 text-center">
      <p className="font-display text-8xl font-medium text-brand-200">404</p>
      <span className="mt-4 grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <Compass className="size-7" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-medium sm:text-4xl">Cette page est introuvable</h1>
      <p className="mt-3 max-w-md text-ink-500">Le lien est peut-être erroné ou la page a été déplacée.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Retour à l’accueil</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/terrains">Voir les terrains</Link>
        </Button>
      </div>
    </main>
  );
}
