import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const fieldBase =
  'w-full rounded-xl border border-ink-200 bg-white px-3.5 text-[15px] text-ink-950 transition-[border-color,box-shadow] duration-200 placeholder:text-ink-400 hover:border-ink-300 focus:border-ink-900 focus:ring-4 focus:ring-ink-900/[0.06] focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-500 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/10';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => <input ref={ref} className={cn(fieldBase, 'h-11', className)} {...props} />,
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn(fieldBase, 'min-h-28 resize-y py-3', className)} {...props} />
  ),
);
Textarea.displayName = 'Textarea';

/** Liste déroulante native stylée : accessible au clavier et optimale sur mobile. */
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <div className="relative">
      <select ref={ref} className={cn(fieldBase, 'h-11 cursor-pointer appearance-none pr-10', className)} {...props}>
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink-400"
      />
    </div>
  ),
);
Select.displayName = 'Select';

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('mb-1.5 block text-sm font-medium text-ink-800', className)} {...props} />;
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-red-600">
      {message}
    </p>
  );
}

interface FieldProps {
  label: React.ReactNode;
  htmlFor: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  /** Élément affiché à droite du libellé (compteur de caractères, aide…) */
  aside?: React.ReactNode;
  children: React.ReactNode;
}

export function Field({ label, htmlFor, error, hint, optional, className, aside, children }: FieldProps) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={htmlFor}>
          {label}
          {optional && <span className="ml-1 font-normal text-ink-400">(facultatif)</span>}
        </Label>
        {aside}
      </div>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}
      <FieldError id={`${htmlFor}-error`} message={error} />
    </div>
  );
}

export function Checkbox({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={cn(
        'size-[18px] shrink-0 cursor-pointer rounded border-ink-300 accent-ink-950',
        className,
      )}
      {...props}
    />
  );
}
