'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import type { Photo, PhotoSlot } from '@/content/site';
import { PHOTO_BUCKET, photoBucketUrl } from '@/lib/content/fields';
import { createClient } from '@/lib/supabase/client';
import { buttonClass } from './ui';

/** Mirrors the bucket's limits in the migration, to explain a refusal before uploading. */
const TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
};
const MAX_BYTES = 10 * 1024 * 1024;

function readSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      reject(new Error('unreadable'));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

/**
 * Uploads straight from the browser to the public bucket, under the slot's
 * folder. The file only goes live once the form is saved; saving also clears
 * the slot's older files (see saveContent).
 */
export function PhotoInput({
  id,
  slot,
  value,
  onChange,
  onUploadingChange,
  error,
}: {
  id: string;
  slot: PhotoSlot;
  value: Photo | null;
  onChange: (value: Photo | null) => void;
  onUploadingChange: (uploading: boolean) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [problem, setProblem] = useState('');

  async function upload(file: File) {
    setProblem('');
    const ext = TYPES[file.type];
    if (!ext) return setProblem('Formats acceptés : JPEG, PNG, WebP ou AVIF.');
    if (file.size > MAX_BYTES) {
      return setProblem('Photo trop lourde (10 Mo maximum). Exportez-la en 2000 à 2400 px de large.');
    }

    setUploading(true);
    onUploadingChange(true);
    try {
      const size = await readSize(file).catch(() => null);
      if (!size) return setProblem('Impossible de lire cette image.');

      const path = `${slot}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await createClient()
        .storage.from(PHOTO_BUCKET)
        // A new name per upload: the file can be cached forever.
        .upload(path, file, { contentType: file.type, cacheControl: '31536000', upsert: false });
      if (uploadError) {
        console.error('[photo upload]', uploadError);
        return setProblem('Le téléversement a échoué. Réessayez dans un instant.');
      }

      onChange({ src: `${photoBucketUrl}${path}`, ...size });
    } finally {
      setUploading(false);
      onUploadingChange(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  const message = problem || error;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
      <div className="relative flex h-[180px] w-full flex-none items-center justify-center overflow-hidden rounded-[6px] border border-anthracite bg-card sm:w-[280px]">
        {value ? (
          <Image
            src={value.src}
            alt=""
            fill
            unoptimized
            sizes="280px"
            className={`object-contain transition-opacity ${uploading ? 'opacity-40' : ''}`}
          />
        ) : (
          <span className="px-6 text-center text-[12px] text-muted">
            Aucune photo : la section s’affiche sans.
          </span>
        )}
        {uploading ? (
          <span className="absolute inset-x-0 bottom-0 bg-noir/80 py-2 text-center text-[12px]">
            Téléversement…
          </span>
        ) : null}
      </div>

      <div className="flex flex-col items-start gap-2">
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={Object.keys(TYPES).join(',')}
          className="peer sr-only"
          disabled={uploading}
          aria-describedby={message ? `${id}-error` : undefined}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void upload(file);
          }}
        />
        <label
          htmlFor={id}
          className={`${buttonClass.secondary} peer-focus-visible:outline-2 peer-focus-visible:outline-orange ${uploading ? 'pointer-events-none opacity-40' : ''}`}
        >
          {value ? 'Remplacer la photo…' : 'Choisir une photo…'}
        </label>
        {value ? (
          <button
            type="button"
            onClick={() => onChange(null)}
            disabled={uploading}
            className={buttonClass.danger}
          >
            Retirer la photo
          </button>
        ) : null}
        {value ? (
          <p className="m-0 text-[12px] text-muted tabular-nums">
            {value.width} × {value.height} px
          </p>
        ) : null}
        {message ? (
          <p id={`${id}-error`} role="alert" className="m-0 max-w-[360px] text-[12px] text-orange">
            {message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
