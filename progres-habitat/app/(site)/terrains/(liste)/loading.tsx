import { PropertyCardSkeleton } from '@/components/property/property-card';
import { Skeleton } from '@/components/ui/misc';

export default function TerrainsLoading() {
  return (
    <div className="pt-header" aria-busy="true" aria-label="Chargement des terrains">
      <div className="border-b border-ink-950/[0.06]">
        <div className="container-page pt-8 pb-10 lg:pt-12 lg:pb-14">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-10 h-14 w-96 max-w-full lg:mt-14" />
          <Skeleton className="mt-4 h-5 w-[32rem] max-w-full" />
        </div>
      </div>
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[16rem_1fr] xl:gap-16">
        <div className="hidden space-y-4 lg:block">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
        <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
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
