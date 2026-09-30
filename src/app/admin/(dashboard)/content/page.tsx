import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdmin } from '@/lib/admin/auth';
import { CONTENT_SECTIONS, fieldId } from '@/lib/content/fields';

export const metadata: Metadata = { title: 'Contenu' };

const formatDate = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Europe/Paris',
});

export default async function AdminContentPage() {
  const { supabase } = await requireAdmin();
  const { data: rows, error } = await supabase.from('site_content').select('key, updated_at');
  const updatedAt = new Map((rows ?? []).map((row) => [row.key, row.updated_at]));

  return (
    <>
      <h1 className="m-0 text-[32px] font-black tracking-[-.02em]">Contenu du site</h1>
      <p className="m-0 mt-1 mb-8 max-w-[680px] text-[14px] text-muted">
        Les textes et les photos du site, en français et en anglais. Chaque enregistrement est en
        ligne immédiatement ; tant qu’une section n’a jamais été modifiée, elle garde ses textes
        d’origine.
      </p>

      {error ? (
        <p role="alert" className="m-0 mb-8 rounded-[4px] border border-orange/60 bg-orange/10 px-4 py-3 text-[13px]">
          Impossible de lire le contenu. Si c’est la première utilisation, la migration{' '}
          <code>site_content</code> n’a sans doute pas été appliquée (voir BACKOFFICE-SETUP.md).
        </p>
      ) : null}

      <ul className="m-0 grid list-none gap-3 p-0 md:grid-cols-2">
        {CONTENT_SECTIONS.map((section) => {
          const last = section.fields
            .map((field) => updatedAt.get(fieldId(field)))
            .filter((date): date is string => Boolean(date))
            .sort()
            .at(-1);

          return (
            <li key={section.id}>
              <Link
                href={`/admin/content/${section.id}`}
                className="group flex h-full flex-col gap-2 rounded-[6px] border border-anthracite bg-card p-5 transition-colors hover:border-orange"
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-[18px] font-bold group-hover:text-orange">{section.title}</span>
                  <span aria-hidden="true" className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-orange">
                    →
                  </span>
                </span>
                <span className="text-[13px] text-muted">{section.description}</span>
                <span className="mt-auto pt-2 text-[12px] text-muted/80">
                  {last ? `Modifié le ${formatDate.format(new Date(last))}` : 'Textes d’origine'}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
