'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, ServerCrash } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="contenu" className="flex min-h-dvh flex-col items-center justify-center bg-sand-50 px-6 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-red-50 text-red-600">
        <ServerCrash className="size-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-medium sm:text-4xl">Un problème est survenu</h1>
      <p className="mt-3 max-w-md text-ink-500">
        Nous n’avons pas pu charger cette page. Vérifiez votre connexion puis réessayez.
        {error.digest && <span className="mt-2 block text-xs text-ink-400">Code : {error.digest}</span>}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>
          <RefreshCw /> Réessayer
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Retour à l’accueil</Link>
        </Button>
      </div>
    </main>
  );
}
