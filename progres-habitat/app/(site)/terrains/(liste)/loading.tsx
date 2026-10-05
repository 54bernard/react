import { PropertyCardSkeleton } from '@/components/property/property-card';
import { Skeleton } from '@/components/ui/misc';

export default function TerrainsLoading() {
  return (
    <div className="pt-header" aria-busy="true" aria-label="Chargement des terrains">
      <div className="border-b border-ink-100 bg-white">
        <div className="container-page space-y-4 py-10 lg:py-14">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-12 w-80 max-w-full" />
          <Skeleton className="h-5 w-[32rem] max-w-full" />
        </div>
      </div>
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[17rem_1fr]">
        <div className="hidden space-y-4 lg:block">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
        <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <PropertyCardSkeleton />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
