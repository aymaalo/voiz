import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { requireAdmin } from '@/lib/admin/auth';

export const metadata: Metadata = { title: 'Modifier le projet' };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) notFound();

  const { supabase } = await requireAdmin();
  const [{ data: project }, { data: tags }] = await Promise.all([
    supabase
      .from('projects')
      .select(
        'id, kind, youtube_id, soundcloud_url, title_fr, title_en, client, description_fr, description_en, services, duration_seconds, published, featured, project_tags(tag_id)',
      )
      .eq('id', Number(id))
      .maybeSingle(),
    supabase.from('tags').select('id, label_fr').order('position').order('id'),
  ]);

  if (!project) notFound();

  const { project_tags: projectTags, kind, ...values } = project;

  return (
    <>
      <Link href="/admin" className="text-[13px] text-muted hover:text-ivoire">
        ← Projets
      </Link>
      <h1 className="m-0 mt-3 mb-8 text-[32px] font-black tracking-[-.02em]">{project.title_fr}</h1>
      <ProjectForm
        // Remount if another project is opened without a full navigation.
        key={project.id}
        project={{
          ...values,
          kind: kind === 'audio' ? 'audio' : 'video',
          tag_ids: projectTags.map((pt) => pt.tag_id),
        }}
        tags={tags ?? []}
      />
    </>
  );
}
