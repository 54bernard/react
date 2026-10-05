'use client';

import { useState } from 'react';
import type { MonthlyStat } from '@/types';

/** Palette validée (daltonisme, contraste) — voir README > Tableau de bord. */
const SERIES = [
  { key: 'leads' as const, label: 'Nouveaux clients', color: '#0e8f73' },
  { key: 'visits' as const, label: 'Demandes de visite', color: '#e36d00' },
];

const monthLabel = (m: string, style: 'short' | 'long' = 'short') =>
  new Date(`${m}-01T00:00:00Z`).toLocaleDateString('fr-FR', { month: style, year: style === 'long' ? 'numeric' : undefined, timeZone: 'UTC' });

/** Histogramme groupé : 6 derniers mois, info-bulle au survol / au focus, tableau accessible. */
export function MonthlyChart({ data }: { data: MonthlyStat[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(1, ...data.flatMap((d) => [d.leads, d.visits]));
  const niceMax = max <= 4 ? 4 : Math.ceil(max / 4) * 4;
  const ticks = [0, niceMax / 4, niceMax / 2, (3 * niceMax) / 4, niceMax];

  const H = 200;
  const W = 600;
  const padL = 32;
  const padB = 28;
  const plotH = H - padB - 8;
  const band = (W - padL) / data.length;
  const barW = Math.min(18, band / 4);
  const y = (v: number) => 8 + plotH - (v / niceMax) * plotH;

  const total = data.reduce((s, d) => ({ leads: s.leads + d.leads, visits: s.visits + d.visits }), { leads: 0, visits: 0 });

  return (
    <figure>
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        {SERIES.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-2 text-[13px] text-ink-600">
            <span className="size-2.5 rounded-[3px]" style={{ background: s.color }} aria-hidden="true" />
            {s.label}
            <span className="font-semibold text-ink-950 tabular-nums">{total[s.key]}</span>
          </span>
        ))}
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Clients et demandes de visite par mois, sur six mois">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={padL} x2={W} y1={y(t)} y2={y(t)} stroke="#e8ecec" strokeWidth="1" />
              <text x={padL - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize="11" fill="#66767c">
                {t}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const cx = padL + band * i + band / 2;
            return (
              <g key={d.month}>
                {/* Zone de survol plus large que les barres */}
                <rect
                  x={padL + band * i}
                  y={0}
                  width={band}
                  height={H - padB}
                  fill={active === i ? '#f3f0ea' : 'transparent'}
                  rx="8"
                  tabIndex={0}
                  role="button"
                  aria-label={`${monthLabel(d.month, 'long')} : ${d.leads} clients, ${d.visits} demandes de visite`}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  style={{ outline: 'none', cursor: 'default' }}
                />
                {SERIES.map((s, j) => {
                  const v = d[s.key];
                  const x = cx - barW - 1 + j * (barW + 2);
                  const top = y(v);
                  const h = Math.max(0, y(0) - top);
                  if (h === 0) return null;
                  const r = Math.min(4, h);
                  // Extrémité arrondie (4 px), base carrée sur l'axe
                  return (
                    <path
                      key={s.key}
                      pointerEvents="none"
                      fill={s.color}
                      d={`M${x},${y(0)} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${y(0)} Z`}
                    />
                  );
                })}
                <text x={cx} y={H - 8} textAnchor="middle" fontSize="11" fill="#66767c" pointerEvents="none">
                  {monthLabel(d.month)}
                </text>
              </g>
            );
          })}
        </svg>

        {active !== null && data[active] && (
          <div
            className="pointer-events-none absolute top-0 z-10 w-44 -translate-x-1/2 rounded-xl border border-ink-100 bg-white p-3 text-[13px] shadow-lift"
            style={{ left: `${((padL + band * active + band / 2) / W) * 100}%` }}
            role="status"
          >
            <p className="mb-1.5 font-semibold text-ink-950 capitalize">{monthLabel(data[active].month, 'long')}</p>
            {SERIES.map((s) => (
              <p key={s.key} className="flex items-center justify-between gap-3 text-ink-600">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-2 rounded-[2px]" style={{ background: s.color }} aria-hidden="true" />
                  {s.label}
                </span>
                <span className="font-semibold text-ink-950 tabular-nums">{data[active]![s.key]}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      <table className="sr-only">
        <caption>Clients et demandes de visite par mois</caption>
        <thead>
          <tr>
            <th scope="col">Mois</th>
            <th scope="col">Nouveaux clients</th>
            <th scope="col">Demandes de visite</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.month}>
              <th scope="row">{monthLabel(d.month, 'long')}</th>
              <td>{d.leads}</td>
              <td>{d.visits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
