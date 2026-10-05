import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PropertyDetail } from '@/components/property/property-detail';
import { Button } from '@/components/ui/button';
import { requireAdminPage } from '@/lib/auth';
import { publicEnv } from '@/lib/env';
import { getAdminProperty } from '@/services/admin';
import { getSettings } from '@/services/content';
import { publicationState } from '@/types';

export const metadata = { title: 'Aperçu' };

const stateLabel = { publie: 'annonce publiée', brouillon: 'brouillon — non visible du public', archive: 'annonce archivée — non visible du public' };

/** Aperçu de l'annonce telle qu'elle apparaîtra sur le site, même si elle n'est pas publiée. */
export default async function PreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase } = await requireAdminPage();
  const [property, settings] = await Promise.all([getAdminProperty(supabase, id), getSettings()]);
  if (!property) notFound();

  return (
    <div className="-mx-4 -my-6 bg-sand-50 sm:-mx-6 lg:-mx-10 lg:-my-10">
      <div className="sticky top-14 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900 sm:px-6 lg:top-0 lg:px-10">
        <p>
          <strong>Aperçu</strong> — {stateLabel[publicationState(property)]}.
        </p>
        <Button asChild size="sm" variant="outline" className="rounded-lg">
          <Link href={`/admin/terrains/${property.id}`}>
            <ArrowLeft /> Retour à l’édition
          </Link>
        </Button>
      </div>
      <PropertyDetail property={property} settings={settings} similar={[]} pageUrl={`${publicEnv.siteUrl}/terrains/${property.slug}`} preview />
    </div>
  );
}
