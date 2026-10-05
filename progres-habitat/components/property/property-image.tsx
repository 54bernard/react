'use client';

import { useState } from 'react';
import Image, { type ImageProps } from 'next/image';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = Omit<ImageProps, 'src' | 'alt'> & { src?: string | null; alt: string };

/** Image Next optimisée avec repli élégant si la photo est absente ou en erreur. */
export function PropertyImage({ src, alt, className, ...props }: Props) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={`${alt} (photo indisponible)`}
        className={cn('flex h-full w-full flex-col items-center justify-center gap-2 bg-sand-100 text-ink-400', className)}
      >
        <ImageOff className="size-7" aria-hidden="true" />
        <span className="text-xs font-medium">Photo bientôt disponible</span>
      </div>
    );
  }
  return <Image src={src} alt={alt} className={className} onError={() => setFailed(true)} {...props} />;
}
