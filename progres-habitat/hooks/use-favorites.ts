'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { syncFavorite } from '@/app/actions/leads';

const STORAGE_KEY = 'ph:favoris';
const DEVICE_KEY = 'ph:appareil';
const listeners = new Set<() => void>();
let cache: string[] | null = null;
const EMPTY: string[] = [];

function read(): string[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(next: string[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Stockage indisponible (navigation privée) : les favoris restent en mémoire.
  }
  listeners.forEach((l) => l());
}

function deviceId(): string {
  try {
    let id = window.localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return 'anonyme-sans-stockage';
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

/** Favoris mémorisés sur l'appareil (et synchronisés anonymement pour les statistiques). */
export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, read, () => EMPTY);

  const toggle = useCallback((propertyId: string) => {
    const current = read();
    const active = !current.includes(propertyId);
    write(active ? [...current, propertyId] : current.filter((id) => id !== propertyId));
    void syncFavorite(deviceId(), propertyId, active).catch(() => undefined);
    return active;
  }, []);

  const isFavorite = useCallback((propertyId: string) => favorites.includes(propertyId), [favorites]);

  return { favorites, toggle, isFavorite };
}
