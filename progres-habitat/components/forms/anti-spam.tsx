'use client';

import { useRef, useState } from 'react';

/**
 * Protection anti-robot des formulaires : horodatage d'ouverture + champ piège invisible.
 * `spamFields()` renvoie les valeurs à transmettre à la Server Action.
 */
export function useAntiSpam() {
  const [startedAt] = useState(() => Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);

  const honeypot = (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Ne pas remplir ce champ
        <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );

  const spamFields = () => ({ website: honeypotRef.current?.value ?? '', startedAt });

  return { honeypot, spamFields };
}
