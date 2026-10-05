import { Breadcrumbs } from '@/components/seo/breadcrumbs';

export function PageHeader({
  title,
  description,
  eyebrow,
  breadcrumbs,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  breadcrumbs: { name: string; path: string }[];
}) {
  return (
    <div className="border-b border-ink-100 bg-white pt-header">
      <div className="container-page py-12 lg:py-16">
        <Breadcrumbs items={breadcrumbs} />
        {eyebrow && <p className="eyebrow mt-8">{eyebrow}</p>}
        <h1 className={`${eyebrow ? 'mt-3' : 'mt-6'} max-w-3xl font-display text-4xl leading-tight font-medium tracking-tight sm:text-5xl`}>
          {title}
        </h1>
        {description && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-500">{description}</p>}
      </div>
    </div>
  );
}
