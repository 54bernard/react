import Link from 'next/link';
import { MapPinOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PropertyNotFound() {
  return (
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center pt-header text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand-600">
        <MapPinOff className="size-8" aria-hidden="true" />
      </span>
      <h1 className="mt-6 font-display text-3xl font-medium sm:text-4xl">Ce terrain n’est plus en ligne</h1>
      <p className="mt-3 max-w-md text-ink-500">
        Il a peut-être été retiré de la vente. Découvrez nos autres terrains disponibles ou contactez un conseiller.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/terrains">Voir les terrains disponibles</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Nous contacter</Link>
        </Button>
      </div>
    </div>
  );
}
