import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  [
    'relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-[-0.005em]',
    'transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-[var(--ease-premium)]',
    'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45',
    '[&_svg]:size-[1.05em] [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        /** Action principale : ardoise profonde, sobre et contrastée */
        primary: 'bg-ink-950 text-white hover:bg-ink-800',
        /** Couleur de marque */
        brand: 'bg-brand-600 text-white hover:bg-brand-700',
        /** Accent orange, utilisé avec parcimonie (hero, appel à l'action) */
        accent: 'bg-accent-500 text-ink-950 hover:bg-accent-400',
        outline: 'border border-ink-200 bg-white text-ink-900 hover:border-ink-900',
        ghost: 'text-ink-700 hover:bg-ink-100 hover:text-ink-950',
        light: 'bg-white text-ink-950 hover:bg-sand-100',
        glass: 'border border-white/25 bg-white/10 text-white backdrop-blur-md hover:border-white/50 hover:bg-white/15',
        whatsapp: 'bg-[#25d366] text-[#073b1c] hover:bg-[#21c45e]',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        'danger-ghost': 'text-red-600 hover:bg-red-50 hover:text-red-700',
        link: 'h-auto rounded-none px-0 text-ink-950 underline decoration-ink-300 underline-offset-4 hover:decoration-ink-950 active:scale-100',
        /** Variante « dark » conservée pour compatibilité */
        dark: 'bg-ink-950 text-white hover:bg-ink-800',
      },
      size: {
        xs: 'h-8 px-3 text-xs',
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-6 text-[15px] sm:h-13 sm:px-7',
        icon: 'size-11',
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
