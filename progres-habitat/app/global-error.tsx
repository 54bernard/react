'use client';

/** Erreur critique (500) : remplace la mise en page racine, donc styles autonomes. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#fbfaf7', color: '#1a272d' }}>
        <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, textAlign: 'center' }}>
          <div>
            <p style={{ fontSize: 64, margin: 0, color: '#acdacc', fontWeight: 600 }}>500</p>
            <h1 style={{ fontSize: 28, margin: '16px 0 8px' }}>Le site est momentanément indisponible</h1>
            <p style={{ color: '#5b6b71', margin: '0 0 24px' }}>Merci de réessayer dans quelques instants.</p>
            <button
              type="button"
              onClick={reset}
              style={{ background: '#176b5a', color: '#fff', border: 0, borderRadius: 12, padding: '12px 20px', fontWeight: 600, cursor: 'pointer' }}
            >
              Réessayer
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
