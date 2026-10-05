'use client';

import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn('border-b border-ink-950/10', className)} {...props} />
));
AccordionItem.displayName = 'AccordionItem';

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'group flex flex-1 cursor-pointer items-center justify-between gap-6 py-6 text-left text-base font-semibold tracking-[-0.01em] text-ink-950 sm:text-[17px]',
        className,
      )}
      {...props}
    >
      {children}
      <span
        aria-hidden="true"
        className="grid size-8 shrink-0 place-items-center rounded-full border border-ink-200 text-ink-600 transition-all duration-500 ease-[var(--ease-premium)] group-hover:border-ink-950 group-data-[state=open]:rotate-45 group-data-[state=open]:border-ink-950 group-data-[state=open]:bg-ink-950 group-data-[state=open]:text-white"
      >
        <Plus className="size-4" />
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-ink-600 data-[state=closed]:animate-[accordion-up_200ms_ease-out] data-[state=open]:animate-[accordion-down_250ms_ease-out]"
    {...props}
  >
    <div className={cn('max-w-2xl pr-12 pb-7 text-[15px] leading-relaxed text-ink-500', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = 'AccordionContent';
