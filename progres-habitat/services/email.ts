import 'server-only';

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);

/**
 * Envoie une notification interne via l'API Resend.
 * Sans RESEND_API_KEY / EMAIL_FROM / EMAIL_TO, l'envoi est simplement ignoré.
 */
export async function sendNotificationEmail(subject: string, fields: Record<string, string | undefined | null>) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const to = process.env.EMAIL_TO;
  if (!apiKey || !from || !to) return { sent: false as const };

  const rows = Object.entries(fields)
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;color:#5b6b71">${escapeHtml(k)}</td><td style="padding:6px 12px;font-weight:600">${escapeHtml(String(v)).replace(/\n/g, '<br>')}</td></tr>`,
    )
    .join('');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: to.split(',').map((s) => s.trim()),
        subject,
        html: `<div style="font-family:Arial,sans-serif;color:#1b2a30"><h2 style="color:#1e846f">${escapeHtml(subject)}</h2><table>${rows}</table></div>`,
      }),
    });
    return { sent: res.ok };
  } catch {
    return { sent: false as const };
  }
}
