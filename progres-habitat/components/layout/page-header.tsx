import { Breadcrumbs } from '@/components/seo/breadcrumbs';

/** En-tête des pages intérieures : fil d'Ariane, sur-titre, grand titre éditorial, chapeau. */
export function PageHeader({
  title,
  description,
  eyebrow,
  breadcrumbs,
  children,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  breadcrumbs: { name: string; path: string }[];
  children?: React.ReactNode;
}) {
  return (
    <div className="border-b border-ink-950/[0.06] pt-header">
      <div className="container-page pt-8 pb-12 lg:pt-12 lg:pb-20">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-10 lg:mt-16">
          {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
          <h1 className="max-w-4xl text-h1">{title}</h1>
          {description && <p className="mt-6 max-w-2xl text-lead text-ink-500">{description}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
