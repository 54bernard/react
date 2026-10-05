'use client';

import { useEffect, useState } from 'react';
import { CalendarCheck, Check, Link2, Phone, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { trackPropertyView } from '@/app/actions/views';
import { VisitForm } from '@/components/forms/visit-form';
import { WhatsAppIcon } from '@/components/layout/whatsapp-icon';
import { FavoriteButton } from '@/components/property/favorite-button';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { trackEvent } from '@/lib/track';
import { cn } from '@/lib/utils';
import { phoneHref, propertyWhatsappMessage, whatsappLink } from '@/lib/whatsapp';
import type { Property } from '@/types';

type ActionProperty = Pick<Property, 'id' | 'slug' | 'reference' | 'title' | 'district' | 'city' | 'price' | 'surface' | 'status'>;

interface Props {
  property: ActionProperty;
  whatsapp: string;
  phone: string;
  pageUrl: string;
  /** Faux pour l'aperçu de l'administration (les vues ne sont pas comptabilisées). */
  trackView?: boolean;
}

function useWhatsappHref(property: ActionProperty, whatsapp: string, pageUrl: string) {
  return whatsappLink(whatsapp, propertyWhatsappMessage(property, pageUrl));
}

export function VisitSheet({
  property,
  trigger,
}: {
  property: ActionProperty;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent title="Demander une visite" description={`${property.title} — réf. ${property.reference}`}>
        <div className="p-5">
          <VisitForm
            properties={[{ id: property.id, label: `${property.reference} — ${property.title}` }]}
            defaultPropertyId={property.id}
            onDone={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function ShareButton({ title, url, className }: { title: string; url: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare(typeof navigator.share === 'function'), []);

  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // partage annulé : on propose la copie du lien
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Lien copié dans le presse-papiers');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Impossible de copier le lien');
    }
  }
  return (
    <button
      type="button"
      onClick={share}
      aria-label="Partager ce terrain"
      className={cn(
        'grid size-11 cursor-pointer place-items-center rounded-full border border-ink-200 bg-white text-ink-700 transition hover:border-ink-300',
        className,
      )}
    >
      {copied ? (
        <Check className="size-[18px] text-emerald-600" />
      ) : canShare ? (
        <Share2 className="size-[18px]" />
      ) : (
        <Link2 className="size-[18px]" />
      )}
    </button>
  );
}

/** Carte d'action (colonne latérale) : WhatsApp, appel, visite, partage, favori. */
export function PropertyActions({ property, whatsapp, phone, pageUrl, trackView = true }: Props) {
  const waHref = useWhatsappHref(property, whatsapp, pageUrl);
  const sold = property.status === 'vendu';

  useEffect(() => {
    if (trackView) void trackPropertyView(property.slug).catch(() => undefined);
  }, [property.slug, trackView]);

  return (
    <div className="space-y-3">
      <Button asChild variant="whatsapp" size="lg" className="w-full">
        <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { ref: property.reference })}>
          <WhatsAppIcon /> {sold ? 'Demander un terrain similaire' : 'Écrire sur WhatsApp'}
        </a>
      </Button>
      <div className="grid grid-cols-2 gap-3">
        <Button asChild variant="outline" size="lg">
          <a href={phoneHref(phone)} onClick={() => trackEvent('phone_click', { ref: property.reference })}>
            <Phone /> Appeler
          </a>
        </Button>
        {sold ? (
          <Button variant="outline" size="lg" disabled>
            Vendu
          </Button>
        ) : (
          <VisitSheet
            property={property}
            trigger={
              <Button variant="dark" size="lg">
                <CalendarCheck /> Visiter
              </Button>
            }
          />
        )}
      </div>
      <div className="flex items-center justify-center gap-3 pt-2">
        <FavoriteButton propertyId={property.id} title={property.title} variant="outline" />
        <ShareButton title={property.title} url={pageUrl} />
      </div>
    </div>
  );
}

/** Barre d'action collante en bas d'écran (mobile). */
export function MobileActionBar({ property, whatsapp, phone, pageUrl }: Props) {
  const waHref = useWhatsappHref(property, whatsapp, pageUrl);
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink-100 bg-white/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="icon" className="size-12 shrink-0 rounded-xl">
          <a href={phoneHref(phone)} aria-label="Appeler" onClick={() => trackEvent('phone_click', { ref: property.reference })}>
            <Phone />
          </a>
        </Button>
        {property.status !== 'vendu' && (
          <VisitSheet
            property={property}
            trigger={
              <Button variant="dark" className="h-12 flex-1 px-3">
                <CalendarCheck /> Visite
              </Button>
            }
          />
        )}
        <Button asChild variant="whatsapp" className="h-12 flex-1 px-3">
          <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent('whatsapp_click', { ref: property.reference })}>
            <WhatsAppIcon /> WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
