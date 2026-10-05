import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'Administration', template: '%s — Administration | Progrès Habitat' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-ink-50">{children}</div>;
}
