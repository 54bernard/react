import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" className={cn('inline-flex shrink-0 items-center', className)} aria-label="Progrès Habitat — accueil">
      <Image
        src="/logo.png"
        alt="Progrès Habitat"
        width={570}
        height={245}
        priority={priority}
        className="h-11 w-auto sm:h-12"
        sizes="140px"
      />
    </Link>
  );
}
