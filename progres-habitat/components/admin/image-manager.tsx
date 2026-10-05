'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Star, Trash2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from '@/schemas/property';

export interface ManagedImage {
  id?: string;
  url: string;
  storage_path?: string | null;
  alt?: string | null;
  is_main: boolean;
}

interface Props {
  propertyId: string;
  value: ManagedImage[];
  onChange: (images: ManagedImage[]) => void;
  disabled?: boolean;
}

const EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' };

/** Vérifie la signature binaire du fichier (en plus du type MIME déclaré par le navigateur). */
async function hasImageSignature(file: File): Promise<boolean> {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return (
    hex.startsWith('ffd8ff') || // JPEG
    hex.startsWith('89504e47') || // PNG
    (hex.startsWith('52494646') && hex.slice(16, 24) === '57454250') || // WEBP
    hex.slice(8, 16) === '66747970' // AVIF (ftyp)
  );
}

export function ImageManager({ propertyId, value, onChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(0);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  /** Réordonne par glisser-déposer (les flèches restent disponibles au clavier). */
  const reorder = (from: number, to: number) => {
    if (from === to) return;
    const next = [...value];
    const [moved] = next.splice(from, 1);
    if (!moved) return;
    next.splice(to, 0, moved);
    onChange(next);
  };

  async function upload(files: FileList | File[]) {
    if (disabled) {
      toast.error('Mode démonstration : l’envoi de photos nécessite Supabase.');
      return;
    }
    const supabase = getSupabaseBrowserClient();
    const list = Array.from(files);
    const added: ManagedImage[] = [];
    setUploading(list.length);
    for (const file of list) {
      if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type) || !(await hasImageSignature(file))) {
        toast.error(`${file.name} : format non accepté (JPG, PNG, WebP ou AVIF).`);
        setUploading((n) => n - 1);
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        toast.error(`${file.name} : fichier trop lourd (8 Mo maximum).`);
        setUploading((n) => n - 1);
        continue;
      }
      const path = `${propertyId}/${crypto.randomUUID()}.${EXT[file.type] ?? 'jpg'}`;
      const { error } = await supabase.storage
        .from('property-images')
        .upload(path, file, { cacheControl: '31536000', contentType: file.type, upsert: false });
      if (error) {
        toast.error(`${file.name} : ${error.message}`);
      } else {
        const { data } = supabase.storage.from('property-images').getPublicUrl(path);
        added.push({ url: data.publicUrl, storage_path: path, alt: '', is_main: false });
      }
      setUploading((n) => n - 1);
    }
    if (added.length > 0) {
      const next = [...value, ...added];
      if (!next.some((i) => i.is_main) && next[0]) next[0] = { ...next[0], is_main: true };
      onChange(next);
      toast.success(`${added.length} photo${added.length > 1 ? 's' : ''} ajoutée${added.length > 1 ? 's' : ''}. Pensez à enregistrer.`);
    }
  }

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target]!, next[index]!];
    onChange(next);
  };

  const setMain = (index: number) => onChange(value.map((img, i) => ({ ...img, is_main: i === index })));

  const remove = (index: number) => {
    const target = value[index];
    // Photo envoyée mais jamais enregistrée : on supprime aussitôt le fichier pour ne pas laisser d'orphelin.
    // Les photos déjà enregistrées sont supprimées du stockage lors de l'enregistrement du terrain.
    if (target && !target.id && target.storage_path && !disabled) {
      void getSupabaseBrowserClient().storage.from('property-images').remove([target.storage_path]);
    }
    const next = value.filter((_, i) => i !== index);
    if (value[index]?.is_main && next[0]) next[0] = { ...next[0], is_main: true };
    onChange(next);
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={(e) => {
          if (!e.dataTransfer.types.includes('Files')) return;
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files.length) void upload(e.dataTransfer.files);
        }}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition',
          dragging ? 'border-ink-950 bg-ink-50' : 'border-ink-200 bg-ink-50/40 hover:border-ink-400',
        )}
      >
        {uploading > 0 ? <Loader2 className="size-8 animate-spin text-brand-600" /> : <UploadCloud className="size-8 text-ink-400" />}
        <p className="font-medium text-ink-800">
          {uploading > 0 ? `Envoi de ${uploading} photo(s)…` : 'Glissez vos photos ici ou cliquez pour parcourir'}
        </p>
        <p className="text-sm text-ink-500">JPG, PNG, WebP ou AVIF · 8 Mo maximum par photo · plusieurs fichiers possibles</p>
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(',')}
          multiple
          className="sr-only"
          onChange={(e) => {
            if (e.target.files?.length) void upload(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {value.length > 0 && (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((img, i) => (
            <li
              key={img.storage_path ?? img.url}
              draggable
              onDragStart={(e) => {
                setDragIndex(i);
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', String(i));
              }}
              onDragOver={(e) => {
                if (dragIndex === null) return;
                e.preventDefault();
                setOverIndex(i);
              }}
              onDragLeave={() => setOverIndex((o) => (o === i ? null : o))}
              onDrop={(e) => {
                if (dragIndex === null) return;
                e.preventDefault();
                e.stopPropagation();
                reorder(dragIndex, i);
                setDragIndex(null);
                setOverIndex(null);
              }}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
              className={cn(
                'overflow-hidden rounded-xl border bg-white transition-[opacity,box-shadow,border-color]',
                img.is_main ? 'border-ink-950' : 'border-ink-100',
                dragIndex === i && 'opacity-40',
                overIndex === i && dragIndex !== i && 'ring-2 ring-brand-500 ring-offset-2',
              )}
            >
              <div className="relative aspect-[4/3] cursor-grab bg-sand-100 active:cursor-grabbing">
                <Image src={img.url} alt={img.alt || `Photo ${i + 1}`} fill sizes="300px" className="object-cover" />
                <span className="absolute top-2 right-2 rounded-md bg-ink-950/70 px-1.5 py-0.5 text-[11px] font-semibold text-white tabular-nums backdrop-blur">
                  {i + 1}
                </span>
                {img.is_main && (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-ink-950 px-2.5 py-1 text-xs font-semibold text-white">
                    <Star className="size-3 fill-white" aria-hidden="true" /> Principale
                  </span>
                )}
              </div>
              <div className="space-y-2 p-3">
                <label className="sr-only" htmlFor={`alt-${i}`}>
                  Texte alternatif de la photo {i + 1}
                </label>
                <input
                  id={`alt-${i}`}
                  value={img.alt ?? ''}
                  onChange={(e) => onChange(value.map((it, j) => (j === i ? { ...it, alt: e.target.value } : it)))}
                  placeholder="Description (accessibilité, SEO)"
                  className="h-9 w-full rounded-lg border border-ink-200 px-2.5 text-sm focus:border-brand-500 focus:outline-none"
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Déplacer vers la gauche" className="grid size-8 cursor-pointer place-items-center rounded-lg text-ink-500 hover:bg-ink-100 disabled:opacity-30">
                      <ArrowUp className="size-4 -rotate-90" />
                    </button>
                    <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Déplacer vers la droite" className="grid size-8 cursor-pointer place-items-center rounded-lg text-ink-500 hover:bg-ink-100 disabled:opacity-30">
                      <ArrowDown className="size-4 -rotate-90" />
                    </button>
                  </div>
                  <div className="flex gap-1">
                    {!img.is_main && (
                      <button type="button" onClick={() => setMain(i)} className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg px-2 text-xs font-medium text-ink-600 hover:bg-ink-100">
                        <Star className="size-3.5" /> Principale
                      </button>
                    )}
                    <button type="button" onClick={() => remove(i)} aria-label="Retirer la photo" className="grid size-8 cursor-pointer place-items-center rounded-lg text-red-600 hover:bg-red-50">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {value.length === 0 && (
        <p className="mt-4 flex items-center gap-2 text-sm text-ink-500">
          <ImagePlus className="size-4" aria-hidden="true" /> Aucune photo : une illustration neutre sera affichée.
        </p>
      )}
    </div>
  );
}
