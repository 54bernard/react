import Image from 'next/image';
import Link from 'next/link';
import { LoginForm } from '@/components/admin/login-form';
import { Button } from '@/components/ui/button';
import { isDemoMode } from '@/lib/env';

export const metadata = { title: 'Connexion' };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const { redirect } = await searchParams;
  const target = redirect?.startsWith('/admin') ? redirect : '/admin';

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden bg-ink-900 lg:block">
        <Image src="/images/hero.webp" alt="" fill sizes="50vw" className="object-cover opacity-60" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
        <p className="absolute right-10 bottom-10 left-10 font-display text-3xl leading-snug text-white">
          Gérez vos terrains, vos demandes clients et vos rendez-vous en un seul endroit.
        </p>
      </div>
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Image src="/logo.png" alt="Progrès Habitat" width={570} height={245} className="h-14 w-auto" priority />
          <h1 className="mt-10 text-2xl font-semibold">Espace administration</h1>
          {isDemoMode ? (
            <div className="mt-6 space-y-4">
              <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                Supabase n’est pas encore configuré : l’administration est consultable en <strong>mode démonstration</strong>{' '}
                (lecture seule). Suivez le README pour activer l’authentification.
              </p>
              <Button asChild size="lg" className="w-full">
                <Link href="/admin">Ouvrir la démonstration</Link>
              </Button>
            </div>
          ) : (
            <>
              <p className="mt-2 text-ink-500">Connectez-vous avec votre compte administrateur.</p>
              <LoginForm redirectTo={target} />
            </>
          )}
          <p className="mt-10 text-sm text-ink-500">
            <Link href="/" className="hover:text-ink-900">
              ← Retour au site
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
