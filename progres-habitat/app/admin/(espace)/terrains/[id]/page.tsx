import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { PropertyForm } from '@/components/admin/property-form';
import { PublicationBadge } from '@/components/admin/publication-badge';
import { AdminPageHeader } from '@/components/admin/ui';
import { StatusBadge } from '@/components/property/status-badge';
import { Button } from '@/components/ui/button';
import { requireAdminPage } from '@/lib/auth';
import { publicEnv } from '@/lib/env';
import { formatDate, formatNumber } from '@/lib/utils';
import { getAdminProperty, listAdminLocations } from '@/services/admin';

export const metadata = { title: 'Modifier un terrain' };

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, isDemo } = await requireAdminPage();
  const [property, locations] = await Promise.all([getAdminProperty(supabase, id), listAdminLocations(supabase)]);
  if (!property) notFound();

  return (
    <>
      <AdminPageHeader
        back={{ href: '/admin/terrains', label: 'Terrains' }}
        title={property.title}
        description={
          <span className="inline-flex flex-wrap items-center gap-2">
            Réf. {property.reference} · {formatNumber(property.views_count)} vue{property.views_count > 1 ? 's' : ''} · modifié le{' '}
            {formatDate(property.updated_at, { day: 'numeric', month: 'long' })}
            <StatusBadge status={property.status} />
            <PublicationBadge property={property} />
          </span>
        }
        actions={
          property.is_published ? (
            <Button asChild variant="outline" size="sm" className="rounded-xl">
              <Link href={`/terrains/${property.slug}`} target="_blank">
                <ExternalLink /> Voir sur le site
              </Link>
            </Button>
          ) : undefined
        }
      />
      <PropertyForm initial={property} locations={locations} isDemo={isDemo} siteUrl={publicEnv.siteUrl} />
    </>
  );
}
