'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Search } from 'lucide-react';
import { typeLabels } from '@/lib/labels';
import { cn } from '@/lib/utils';
import { PROPERTY_TYPES } from '@/types';

interface Props {
  zones: { slug: string; name: string; city: string }[];
}

const budgets = [
  { value: '', label: 'Tous budgets' },
  { value: '3000000', label: 'Jusqu’à 3 M FCFA' },
  { value: '5000000', label: 'Jusqu’à 5 M FCFA' },
  { value: '10000000', label: 'Jusqu’à 10 M FCFA' },
  { value: '20000000', label: 'Jusqu’à 20 M FCFA' },
];

const surfaces = [
  { value: '', label: 'Toutes surfaces' },
  { value: '250', label: '250 m² et plus' },
  { value: '400', label: '400 m² et plus' },
  { value: '1000', label: '1 000 m² et plus' },
  { value: '10000', label: '1 hectare et plus' },
];

function Field({ id, label, children, className }: { id: string; label: string; children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'group relative flex min-w-0 flex-1 flex-col justify-center rounded-xl px-4 py-3 transition-colors duration-300 hover:bg-sand-100 focus-within:bg-sand-100 lg:rounded-full lg:px-6',
        className,
      )}
    >
      <label htmlFor={id} className="text-[11px] font-semibold tracking-[0.12em] text-ink-500 uppercase">
        {label}
      </label>
      <div className="relative">{children}</div>
    </div>
  );
}

const selectClass =
  'mt-1 w-full cursor-pointer appearance-none truncate bg-transparent pr-6 text-[15px] font-medium text-ink-950 focus:outline-none focus-visible:outline-none';

function Chevron() {
  return <ChevronDown aria-hidden="true" className="pointer-events-none absolute top-1/2 right-0 size-4 -translate-y-1/2 text-ink-400" />;
}

/** Moteur de recherche du hero : localisation, budget, superficie, type. */
export function HeroSearch({ zones }: Props) {
  const router = useRouter();
  const [zone, setZone] = useState('');
  const [budget, setBudget] = useState('');
  const [surface, setSurface] = useState('');
  const [type, setType] = useState('');

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (zone.startsWith('ville:')) params.set('ville', zone.slice(6));
    else if (zone) params.set('zone', zone);
    if (budget) params.set('maxPrice', budget);
    if (surface) params.set('minSurface', surface);
    if (type) params.set('type', type);
    params.set('statut', 'disponible');
    router.push(`/terrains?${params.toString()}`);
  }

  const cities = [...new Set(zones.map((z) => z.city))];

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      aria-label="Rechercher un terrain"
      className="grid grid-cols-2 gap-1 rounded-2xl bg-white p-2 shadow-[0_30px_80px_-30px_rgb(0_0_0/0.6)] lg:flex lg:items-center lg:gap-0 lg:rounded-full lg:p-2"
    >
      <Field id="hero-zone" label="Localisation" className="col-span-2 lg:col-span-1">
        <select id="hero-zone" className={selectClass} value={zone} onChange={(e) => setZone(e.target.value)}>
          <option value="">Toutes les zones</option>
          {cities.map((city) => (
            <optgroup key={city} label={city}>
              <option value={`ville:${city}`}>Tout {city}</option>
              {zones
                .filter((z) => z.city === city)
                .map((z) => (
                  <option key={z.slug} value={z.slug}>
                    {z.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
        <Chevron />
      </Field>
      <span aria-hidden="true" className="hidden h-8 w-px bg-ink-100 lg:block" />
      <Field id="hero-budget" label="Budget">
        <select id="hero-budget" className={selectClass} value={budget} onChange={(e) => setBudget(e.target.value)}>
          {budgets.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
        <Chevron />
      </Field>
      <span aria-hidden="true" className="hidden h-8 w-px bg-ink-100 lg:block" />
      <Field id="hero-surface" label="Superficie">
        <select id="hero-surface" className={selectClass} value={surface} onChange={(e) => setSurface(e.target.value)}>
          {surfaces.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <Chevron />
      </Field>
      <span aria-hidden="true" className="hidden h-8 w-px bg-ink-100 lg:block" />
      <Field id="hero-type" label="Type de terrain" className="col-span-2 lg:col-span-1">
        <select id="hero-type" className={selectClass} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Tous les types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {typeLabels[t]}
            </option>
          ))}
        </select>
        <Chevron />
      </Field>
      <div className="col-span-2 pt-1 lg:pt-0 lg:pl-2">
        <button
          type="submit"
          className="flex h-13 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-ink-950 px-7 text-[15px] font-semibold text-white transition-[background-color,transform] duration-300 hover:bg-ink-800 active:scale-[0.98] lg:h-14 lg:w-auto lg:rounded-full"
        >
          <Search className="size-[18px]" aria-hidden="true" /> Rechercher
        </button>
      </div>
    </form>
  );
}
