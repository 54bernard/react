import * as React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('skeleton rounded-xl', className)} />;
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-2xl border border-ink-100 bg-white', className)} {...props} />;
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
  as?: 'h1' | 'h2';
  id?: string;
  action?: React.ReactNode;
  tone?: 'default' | 'inverse';
}

/** En-tête de section : sur-titre discret, titre éditorial, chapeau, action alignée à droite. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  as: Heading = 'h2',
  id,
  action,
  tone = 'default',
}: SectionHeadingProps) {
  const inverse = tone === 'inverse';
  return (
    <div
      className={cn(
        'flex flex-col gap-8',
        align === 'center' ? 'items-center text-center' : 'lg:flex-row lg:items-end lg:justify-between lg:gap-16',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && <p className={cn('eyebrow mb-5', inverse && '!text-white/60')}>{eyebrow}</p>}
        <Heading id={id} className={cn('text-h2', inverse && '!text-white')}>
          {title}
        </Heading>
        {description && (
          <p className={cn('mt-5 max-w-xl text-lead', inverse ? 'text-white/65' : 'text-ink-500', align === 'center' && 'mx-auto')}>
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center',
        className,
      )}
    >
      {icon && <div className="mb-5 grid size-12 place-items-center rounded-full bg-sand-100 text-ink-700 [&_svg]:size-5">{icon}</div>}
      <h3 className="text-base font-semibold text-ink-950">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
