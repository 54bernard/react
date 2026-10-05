import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Logo cliquable. `tone="light"` : version au texte blanc pour les fonds sombres (hero, pied de page). */
export function Logo({
  className,
  priority = false,
  tone = 'dark',
  size = 'md',
}: {
  className?: string;
  priority?: boolean;
  tone?: 'dark' | 'light';
  size?: 'md' | 'lg';
}) {
  return (
    <Link href="/" className={cn('inline-flex shrink-0 items-center', className)} aria-label="Progrès Habitat — accueil">
      <Image
        src={tone === 'light' ? '/logo-light.png' : '/logo.png'}
        alt="Progrès Habitat"
        width={570}
        height={245}
        priority={priority}
        className={cn('w-auto', size === 'lg' ? 'h-12 sm:h-14' : 'h-9 sm:h-10 lg:h-11')}
        sizes="140px"
      />
    </Link>
  );
}
