'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { PropertyCard } from '@/components/property/property-card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/misc';
import { useFavorites } from '@/hooks/use-favorites';
import type { PropertyWithRelations } from '@/types';

export function FavoritesList({ properties }: { properties: PropertyWithRelations[] }) {
  const { favorites } = useFavorites();
  const items = properties.filter((p) => favorites.includes(p.id));

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Heart className="size-6" />}
        title="Aucun favori pour le moment"
        description="Touchez le cœur sur un terrain pour l’enregistrer et le retrouver ici."
        action={
          <Button asChild>
            <Link href="/terrains">Parcourir les terrains</Link>
          </Button>
        }
      />
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <li key={p.id}>
          <PropertyCard property={p} />
        </li>
      ))}
    </ul>
  );
}
