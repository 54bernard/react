import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { LoginForm } from '@/components/admin/login-form';
import { Button } from '@/components/ui/button';
import { isDemoAdminAllowed, isSupabaseConfigured } from '@/lib/env';

export const metadata = { title: 'Connexion' };
export const dynamic = 'force-dynamic';

type SP = Promise<{ redirect?: string; erreur?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: SP }) {
  const { redirect, erreur } = await searchParams;
  // Seules les redirections internes à l'administration sont acceptées (pas de redirection ouverte)
  const target = redirect && /^\/admin(\/[\w\-/]*)?$/.test(redirect) ? redirect : '/admin';

  return (
    <main className="grid min-h-dvh bg-white lg:grid-cols-[1fr_1.1fr]">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition hover:text-ink-950">
          <ArrowLeft className="size-4" aria-hidden="true" /> Retour au site
        </Link>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          <Image src="/logo.png" alt="Progrès Habitat" width={570} height={245} className="h-12 w-auto self-start" priority />
          <h1 className="mt-10 text-2xl font-semibold tracking-tight text-ink-950">Espace administration</h1>

          {erreur === 'acces' && (
            <p role="alert" className="mt-6 flex gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-800">
              <ShieldAlert className="size-5 shrink-0" aria-hidden="true" />
              Ce compte n’a pas accès au back-office. Demandez à un administrateur de vous ajouter.
            </p>
          )}

          {isSupabaseConfigured ? (
            <>
              <p className="mt-2 text-sm text-ink-500">Connectez-vous avec votre compte administrateur.</p>
              <LoginForm redirectTo={target} />
            </>
          ) : isDemoAdminAllowed() ? (
            <div className="mt-6 space-y-4">
              <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                Supabase n’est pas configuré : l’administration est consultable en <strong>mode démonstration</strong> (lecture seule,
                données d’exemple). Suivez le README pour activer l’authentification.
              </p>
              <Button asChild size="lg" className="w-full rounded-xl">
                <Link href="/admin">Ouvrir la démonstration</Link>
              </Button>
            </div>
          ) : (
            <p role="alert" className="mt-6 rounded-xl bg-ink-50 p-4 text-sm text-ink-700">
              L’administration est désactivée : configurez <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_URL</code> et{' '}
              <code className="font-mono text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> pour activer la connexion sécurisée.
            </p>
          )}
        </div>
        <p className="text-xs text-ink-400">Accès réservé aux équipes Progrès Habitat.</p>
      </div>
      <div className="relative hidden lg:block">
        <Image src="/images/hero.webp" alt="" fill sizes="55vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-transparent" />
        <p className="absolute right-12 bottom-12 left-12 max-w-md font-display text-3xl leading-snug text-white">
          Terrains, clients et visites, réunis dans un seul espace.
        </p>
      </div>
    </main>
  );
}
