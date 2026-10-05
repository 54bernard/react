'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, LogIn } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form-controls';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

const schema = z.object({
  email: z.string().trim().email('Adresse e-mail invalide.'),
  password: z.string().min(8, 'Mot de passe trop court.'),
});
type Values = z.infer<typeof schema>;

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) });

  const onSubmit = handleSubmit(async ({ email, password }) => {
    setError(null);
    const { error: authError } = await getSupabaseBrowserClient().auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message === 'Invalid login credentials' ? 'Identifiants incorrects.' : authError.message);
      return;
    }
    router.replace(redirectTo);
    router.refresh();
  });

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
      <Field label="E-mail" htmlFor="email" error={errors.email?.message}>
        <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby="email-error" {...register('email')} />
      </Field>
      <Field label="Mot de passe" htmlFor="password" error={errors.password?.message}>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          aria-describedby="password-error"
          {...register('password')}
        />
      </Field>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : <LogIn />} Se connecter
      </Button>
    </form>
  );
}
