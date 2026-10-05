import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { PropertyForm } from '@/components/admin/property-form';
import { AdminPageHeader } from '@/components/admin/ui';
import { StatusBadge } from '@/components/property/status-badge';
import { Button } from '@/components/ui/button';
import { getAdminContext } from '@/lib/auth';
import { getAdminProperty } from '@/services/admin';
import { getLocations } from '@/services/properties';

export const metadata = { title: 'Modifier un terrain' };

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await getAdminContext();
  const supabase = ctx.mode === 'live' ? ctx.supabase : null;
  const [property, locations] = await Promise.all([getAdminProperty(supabase, id), getLocations()]);
  if (!property) notFound();

  return (
    <>
      <AdminPageHeader
        title={property.title}
        description={`Réf. ${property.reference} · ${property.views_count} vue${property.views_count > 1 ? 's' : ''}`}
        actions={
          <>
            <StatusBadge status={property.status} className="self-center" />
            {property.is_published && (
              <Button asChild variant="outline" size="sm">
                <Link href={`/terrains/${property.slug}`} target="_blank">
                  <ExternalLink /> Voir sur le site
                </Link>
              </Button>
            )}
          </>
        }
      />
      <PropertyForm initial={property} locations={locations} isDemo={ctx.mode !== 'live'} />
    </>
  );
}
