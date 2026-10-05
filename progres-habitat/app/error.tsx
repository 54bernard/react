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
      <ServerCrash className="size-7 text-red-600" strokeWidth={1.5} aria-hidden="true" />
      <h1 className="text-h1 mt-8 max-w-2xl">Un problème est survenu</h1>
      <p className="mt-5 max-w-md text-lead text-ink-500">
        Nous n’avons pas pu charger cette page. Vérifiez votre connexion puis réessayez.
        {error.digest && <span className="mt-2 block text-xs text-ink-400">Code : {error.digest}</span>}
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
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
