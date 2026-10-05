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
        'grid cursor-pointer place-items-center rounded-full transition-[color,background-color,border-color,transform] duration-300 active:scale-90',
        variant === 'overlay'
          ? 'size-10 text-white hover:bg-white/15'
          : 'size-11 border border-ink-200 bg-white text-ink-800 hover:border-ink-950',
        active && (variant === 'overlay' ? 'text-white' : 'text-accent-600'),
        className,
      )}
    >
      <Heart
        className={cn(
          'size-[19px] transition-transform duration-300',
          variant === 'overlay' && 'drop-shadow-[0_1px_2px_rgb(0_0_0/0.35)]',
          active && 'scale-110 fill-accent-500 text-accent-500',
        )}
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </button>
  );
}
