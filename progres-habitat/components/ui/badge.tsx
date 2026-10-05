import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none tracking-wide whitespace-nowrap [&_svg]:size-3.5',
  {
    variants: {
      variant: {
        neutral: 'bg-ink-100 text-ink-700',
        brand: 'bg-brand-50 text-brand-800',
        accent: 'bg-accent-50 text-accent-700',
        success: 'bg-emerald-50 text-emerald-800',
        warning: 'bg-amber-50 text-amber-900',
        danger: 'bg-red-50 text-red-700',
        outline: 'border border-ink-200 bg-white text-ink-700',
        solid: 'bg-white/95 text-ink-900 shadow-soft backdrop-blur',
        dark: 'bg-ink-950/80 text-white backdrop-blur',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
