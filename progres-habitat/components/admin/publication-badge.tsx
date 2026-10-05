import { Badge } from '@/components/ui/badge';
import { publicationState, type Property } from '@/types';

const config = {
  publie: { label: 'Publié', variant: 'brand' },
  brouillon: { label: 'Brouillon', variant: 'outline' },
  archive: { label: 'Archivé', variant: 'neutral' },
} as const;

export function PublicationBadge({ property }: { property: Pick<Property, 'is_published' | 'archived_at'> }) {
  const { label, variant } = config[publicationState(property)];
  return <Badge variant={variant}>{label}</Badge>;
}
