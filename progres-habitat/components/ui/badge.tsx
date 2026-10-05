import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold leading-none whitespace-nowrap [&_svg]:size-3.5',
  {
    variants: {
      variant: {
        neutral: 'bg-ink-100 text-ink-700',
        brand: 'bg-brand-50 text-brand-700 ring-1 ring-brand-100',
        accent: 'bg-accent-50 text-accent-700 ring-1 ring-accent-100',
        success: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
        warning: 'bg-amber-50 text-amber-800 ring-1 ring-amber-100',
        danger: 'bg-red-50 text-red-700 ring-1 ring-red-100',
        solid: 'bg-white/95 text-ink-900 shadow-soft backdrop-blur',
        dark: 'bg-ink-900/85 text-white backdrop-blur',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
