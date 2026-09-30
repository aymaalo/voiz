import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ContentForm } from '@/components/admin/ContentForm';
import { requireAdmin } from '@/lib/admin/auth';
import { defaultValue, fieldId, getSection, resolveValue } from '@/lib/content/fields';

type Props = { params: Promise<{ section: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params;
  return { title: getSection(section)?.title ?? 'Contenu' };
}

export default async function AdminContentSectionPage({ params }: Props) {
  const { supabase } = await requireAdmin();
  const section = getSection((await params).section);
  if (!section) notFound();

  const keys = section.fields.map(fieldId);
  const { data: rows, error } = await supabase
    .from('site_content')
    .select('key, value')
    .in('key', keys);
  const stored = new Map((rows ?? []).map((row) => [row.key, row.value]));

  const values = Object.fromEntries(
    section.fields.map((field) => [fieldId(field), resolveValue(field, stored.get(fieldId(field)))]),
  );
  const defaults = Object.fromEntries(
    section.fields.map((field) => [fieldId(field), defaultValue(field)]),
  );

  return (
    <>
      <Link
        href="/admin/content"
        className="text-[13px] text-muted transition-colors hover:text-ivoire"
      >
        ← Contenu
      </Link>
      <h1 className="m-0 mt-3 text-[32px] font-black tracking-[-.02em]">{section.title}</h1>
      <p className="m-0 mt-1 mb-8 max-w-[680px] text-[14px] text-muted">{section.description}</p>

      {error ? (
        <p role="alert" className="text-orange">
          Impossible de charger le contenu. Rechargez la page.
        </p>
      ) : (
        <ContentForm section={section} values={values} defaults={defaults} />
      )}
    </>
  );
}
