import { PageHeader } from '@/components/layout/page-header';

export function LegalPage({
  title,
  path,
  updated,
  sections,
}: {
  title: string;
  path: string;
  updated: string;
  sections: { title: string; body: React.ReactNode }[];
}) {
  return (
    <>
      <PageHeader breadcrumbs={[{ name: title, path }]} title={title} description={`Dernière mise à jour : ${updated}`} />
      <article className="container-page max-w-3xl py-14 lg:py-20">
        <div className="space-y-10">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-xl font-semibold text-ink-900">{s.title}</h2>
              <div className="mt-3 space-y-3 leading-relaxed text-ink-600">{s.body}</div>
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
