'use client';

import { WifiOff } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { WhatsAppIcon } from '@/components/layout/whatsapp-icon';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { whatsappLink } from '@/lib/whatsapp';

export function OfflineBanner() {
  const online = useOnlineStatus();
  return (
    <div
      role="status"
      aria-hidden={online}
      className={`fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-ink-900 px-5 py-3 text-sm font-medium text-white shadow-lift transition-[opacity,translate] duration-300 ${online ? 'pointer-events-none translate-y-20 opacity-0' : ''}`}
    >
      {!online && (
        <>
          <WifiOff className="size-4" aria-hidden="true" />
          Connexion perdue — certaines informations peuvent ne pas être à jour.
        </>
      )}
    </div>
  );
}

/** Bouton WhatsApp flottant (masqué sur les fiches terrain qui ont leur propre barre d'action). */
export function FloatingWhatsApp({ whatsapp }: { whatsapp: string }) {
  const pathname = usePathname();
  if (/^\/terrains\/[^/]+$/.test(pathname)) return null;
  return (
    <a
      href={whatsappLink(whatsapp, 'Bonjour Progrès Habitat, je souhaite des informations sur vos terrains.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuter avec un conseiller sur WhatsApp"
      className="fixed right-4 bottom-4 z-30 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-lift transition hover:scale-105 sm:right-6 sm:bottom-6"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
