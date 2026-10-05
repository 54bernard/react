import Link from 'next/link';
import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main id="contenu" className="flex min-h-dvh flex-col items-center justify-center bg-sand-50 px-6 text-center">
      <Compass className="size-7 text-brand-700" strokeWidth={1.5} aria-hidden="true" />
      <p className="eyebrow mt-8">Erreur 404</p>
      <h1 className="text-h1 mt-5 max-w-2xl">Cette page est introuvable</h1>
      <p className="mt-5 max-w-md text-lead text-ink-500">Le lien est peut-être erroné ou la page a été déplacée.</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
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
