import 'server-only';

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Limiteur à fenêtre fixe, en mémoire (par instance serveur). Il complète le
 * déclencheur SQL `leads_rate_limit` qui, lui, s'applique globalement.
 */
export function rateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k);
  }
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterMs: 0 };
  }
  if (bucket.count >= limit) return { allowed: false, retryAfterMs: bucket.resetAt - now };
  bucket.count += 1;
  return { allowed: true, retryAfterMs: 0 };
}
