import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-[1.1em] [&_svg]:shrink-0 cursor-pointer',
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 text-white shadow-soft hover:bg-brand-700 focus-visible:outline-brand-600',
        accent: 'bg-accent-500 text-ink-950 shadow-soft hover:bg-accent-400 focus-visible:outline-accent-500',
        dark: 'bg-ink-900 text-white hover:bg-ink-800 focus-visible:outline-ink-900',
        outline: 'border border-ink-200 bg-white text-ink-900 hover:border-ink-300 hover:bg-ink-50',
        ghost: 'text-ink-700 hover:bg-ink-100 hover:text-ink-900',
        light: 'bg-white text-ink-900 shadow-soft hover:bg-sand-100',
        glass: 'border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20',
        whatsapp: 'bg-[#25d366] text-[#0b3d1f] hover:bg-[#1fbe5b] focus-visible:outline-[#25d366]',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        link: 'h-auto px-0 text-brand-700 underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-3.5 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-13 px-6 text-base',
        icon: 'size-10',
        'icon-sm': 'size-9',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
  },
);
Button.displayName = 'Button';
