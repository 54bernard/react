import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbJsonLd } from '@/lib/seo';
import { cn } from '@/lib/utils';

export function Breadcrumbs({ items, className }: { items: { name: string; path: string }[]; className?: string }) {
  const all = [{ name: 'Accueil', path: '/' }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <nav aria-label="Fil d’Ariane" className={cn('text-sm text-ink-500', className)}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {all.map((item, i) => {
            const last = i === all.length - 1;
            return (
              <li key={item.path} className="flex min-w-0 items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className="truncate font-medium text-ink-800">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.path} className="transition hover:text-brand-700">
                      {item.name}
                    </Link>
                    <ChevronRight className="size-3.5 text-ink-300" aria-hidden="true" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
