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
      <article className="container-page max-w-3xl py-14 lg:py-24">
        <div className="space-y-12">
          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-h3">{s.title}</h2>
              <div className="mt-4 space-y-4 text-[16.5px] leading-[1.75] text-ink-600 [&_a]:text-ink-950 [&_a]:underline [&_a]:underline-offset-4">{s.body}</div>
            </section>
          ))}
        </div>
      </article>
    </>
  );
}
