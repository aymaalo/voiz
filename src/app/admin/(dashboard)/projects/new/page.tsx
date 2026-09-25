import type { Metadata } from 'next';
import Link from 'next/link';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { requireAdmin } from '@/lib/admin/auth';

export const metadata: Metadata = { title: 'Nouveau projet' };

export default async function NewProjectPage() {
  const { supabase } = await requireAdmin();
  const { data: tags } = await supabase.from('tags').select('id, label_fr').order('position').order('id');

  return (
    <>
      <Link href="/admin" className="text-[13px] text-muted hover:text-ivoire">
        ← Projets
      </Link>
      <h1 className="m-0 mt-3 mb-8 text-[32px] font-black tracking-[-.02em]">Nouveau projet</h1>
      <ProjectForm tags={tags ?? []} />
    </>
  );
}
