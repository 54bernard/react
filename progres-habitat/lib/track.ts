'use client';

type TrackWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

/** Suivi des conversions (clic WhatsApp, appel, formulaire). Sans effet si l'analytics n'est pas configuré. */
export function trackEvent(name: 'whatsapp_click' | 'phone_click' | 'lead_submit' | 'visit_request', params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  const w = window as TrackWindow;
  w.gtag?.('event', name, params);
  if (name === 'lead_submit' || name === 'visit_request') w.fbq?.('track', 'Lead', params);
  else w.fbq?.('track', 'Contact', params);
}
