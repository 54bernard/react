import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PropertyDetail } from '@/components/property/property-detail';
import { Button } from '@/components/ui/button';
import { getAdminContext } from '@/lib/auth';
import { publicEnv } from '@/lib/env';
import { getAdminProperty } from '@/services/admin';
import { getSettings } from '@/services/content';

export const metadata = { title: 'Aperçu' };

/** Aperçu de l'annonce telle qu'elle apparaîtra sur le site, même si elle n'est pas encore publiée. */
export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await getAdminContext();
  const supabase = ctx.mode === 'live' ? ctx.supabase : null;
  const [property, settings] = await Promise.all([getAdminProperty(supabase, id), getSettings()]);
  if (!property) notFound();

  return (
    <div className="-mx-4 -my-8 bg-sand-50 sm:-mx-6 lg:-mx-10 lg:-my-10">
      <div className="sticky top-16 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:px-6 lg:top-0 lg:px-10">
        <p>
          <strong>Aperçu</strong> — {property.is_published ? 'annonce publiée' : 'brouillon non visible du public'}.
        </p>
        <Button asChild size="sm" variant="outline">
          <Link href={`/admin/terrains/${property.id}`}>
            <ArrowLeft /> Retour à l’édition
          </Link>
        </Button>
      </div>
      <PropertyDetail property={property} settings={settings} similar={[]} pageUrl={`${publicEnv.siteUrl}/terrains/${property.slug}`} preview />
    </div>
  );
}
