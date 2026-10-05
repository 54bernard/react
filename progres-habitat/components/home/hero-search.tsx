'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { typeLabels } from '@/lib/labels';
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
  { value: '250', label: '250 m² et +' },
  { value: '400', label: '400 m² et +' },
  { value: '1000', label: '1 000 m² et +' },
  { value: '10000', label: '1 ha et +' },
];

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="group relative flex-1 rounded-2xl px-4 py-2.5 transition-colors hover:bg-ink-50 focus-within:bg-ink-50 lg:rounded-xl">
      <label htmlFor={id} className="block text-[11px] font-semibold tracking-[0.12em] text-ink-500 uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}

const selectClass =
  'mt-0.5 w-full cursor-pointer appearance-none bg-transparent text-[15px] font-medium text-ink-900 focus:outline-none';

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
      className="grid grid-cols-2 gap-1 rounded-3xl bg-white p-2 shadow-lift lg:flex lg:items-center lg:divide-x lg:divide-ink-100 lg:rounded-2xl"
    >
      <Field id="hero-zone" label="Localisation">
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
      </Field>
      <Field id="hero-budget" label="Budget">
        <select id="hero-budget" className={selectClass} value={budget} onChange={(e) => setBudget(e.target.value)}>
          {budgets.map((b) => (
            <option key={b.value} value={b.value}>
              {b.label}
            </option>
          ))}
        </select>
      </Field>
      <Field id="hero-surface" label="Superficie">
        <select id="hero-surface" className={selectClass} value={surface} onChange={(e) => setSurface(e.target.value)}>
          {surfaces.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </Field>
      <Field id="hero-type" label="Type de terrain">
        <select id="hero-type" className={selectClass} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Tous types</option>
          {PROPERTY_TYPES.map((t) => (
            <option key={t} value={t}>
              {typeLabels[t]}
            </option>
          ))}
        </select>
      </Field>
      <div className="col-span-2 p-1 lg:col-span-1 lg:border-0 lg:pl-2">
        <Button type="submit" size="lg" className="w-full lg:w-auto lg:px-7">
          <Search /> Rechercher
        </Button>
      </div>
    </form>
  );
}
