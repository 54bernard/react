'use client';

import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useFavorites } from '@/hooks/use-favorites';
import { cn } from '@/lib/utils';

interface Props {
  propertyId: string;
  title: string;
  className?: string;
  variant?: 'overlay' | 'outline';
}

export function FavoriteButton({ propertyId, title, className, variant = 'overlay' }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(propertyId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const added = toggle(propertyId);
        toast.success(added ? 'Ajouté à vos favoris' : 'Retiré de vos favoris', { duration: 1800 });
      }}
      aria-pressed={active}
      aria-label={active ? `Retirer « ${title} » des favoris` : `Ajouter « ${title} » aux favoris`}
      className={cn(
        'grid cursor-pointer place-items-center rounded-full transition-[color,background-color,transform] active:scale-90',
        variant === 'overlay'
          ? 'size-10 bg-white/90 text-ink-700 shadow-soft backdrop-blur hover:bg-white'
          : 'size-11 border border-ink-200 bg-white text-ink-700 hover:border-ink-300',
        active && 'text-accent-500',
        className,
      )}
    >
      <Heart className={cn('size-[18px] transition-all', active && 'fill-accent-500')} aria-hidden="true" />
    </button>
  );
}
