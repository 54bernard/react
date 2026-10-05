import * as React from 'react';
import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('skeleton rounded-xl', className)} />;
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-2xl border border-ink-100 bg-white shadow-soft', className)} {...props} />;
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
  as?: 'h1' | 'h2';
  action?: React.ReactNode;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  as: Heading = 'h2',
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <Heading className="font-display text-3xl leading-[1.12] font-medium tracking-tight sm:text-4xl lg:text-[2.75rem]">
          {title}
        </Heading>
        {description && <p className="mt-4 text-base leading-relaxed text-ink-500 sm:text-lg">{description}</p>}
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
        'flex flex-col items-center rounded-3xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center',
        className,
      )}
    >
      {icon && <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-brand-50 text-brand-600">{icon}</div>}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-2 max-w-md text-ink-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
