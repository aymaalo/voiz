import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { deleteProject, moveProject, setProjectFeatured, setProjectPublished } from '@/app/admin/actions';
import { ConfirmSubmit } from '@/components/admin/ConfirmSubmit';
import { buttonClass } from '@/components/admin/ui';
import { requireAdmin } from '@/lib/admin/auth';
import { formatDuration, youTubeThumbnailUrl } from '@/lib/youtube';

export const metadata: Metadata = { title: 'Projets' };

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { supabase } = await requireAdmin();
  const { saved } = await searchParams;

  const [{ data: projects, error }, { data: tags }] = await Promise.all([
    supabase
      .from('projects')
      .select(
        'id, kind, title_fr, client, youtube_id, soundcloud_url, duration_seconds, published, featured, project_tags(tag_id)',
      )
      .order('position')
      .order('id'),
    supabase.from('tags').select('id, label_fr').order('position').order('id'),
  ]);

  const tagLabels = new Map((tags ?? []).map((tag) => [tag.id, tag.label_fr]));
  const tagOrder = new Map((tags ?? []).map((tag, index) => [tag.id, index]));
  const savedProject = projects?.find((p) => String(p.id) === saved);

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="m-0 text-[32px] font-black tracking-[-.02em]">Projets</h1>
          <p className="m-0 mt-1 text-[14px] text-muted">
            Affichés sur le site dans cet ordre. « Accueil » : dans la sélection de la page d’accueil ; tous les projets publiés sont sur la page Projets.
          </p>
        </div>
        <Link href="/admin/projects/new" className={buttonClass.primary}>
          + Nouveau projet
        </Link>
      </div>

      {savedProject ? (
        <p role="status" className="m-0 mb-6 rounded-[4px] border border-anthracite px-4 py-3 text-[13px]">
          <strong>{savedProject.title_fr}</strong> est enregistré
          {!savedProject.published
            ? ' (non publié).'
            : savedProject.featured
              ? ' et en ligne, en avant sur l’accueil.'
              : ' et en ligne sur la page Projets.'}
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="text-orange">
          Impossible de charger les projets. Rechargez la page.
        </p>
      ) : !projects?.length ? (
        <div className="rounded-[6px] border border-dashed border-anthracite px-6 py-16 text-center">
          <p className="m-0 mb-5 text-muted">Aucun projet pour le moment.</p>
          <Link href="/admin/projects/new" className={buttonClass.primary}>
            Ajouter le premier projet
          </Link>
        </div>
      ) : (
        <ol className="m-0 flex list-none flex-col gap-2 p-0">
          {projects.map((project, index) => {
            const labels = project.project_tags
              .map((pt) => pt.tag_id)
              .filter((id) => tagLabels.has(id))
              .sort((a, b) => tagOrder.get(a)! - tagOrder.get(b)!)
              .map((id) => tagLabels.get(id)!);

            return (
              <li
                key={project.id}
                className={`flex flex-wrap items-center gap-x-4 gap-y-3 rounded-[6px] border bg-card p-3 ${
                  project.published ? 'border-anthracite' : 'border-dashed border-anthracite/80'
                }`}
              >
                <div className="flex flex-col gap-1">
                  <form action={moveProject}>
                    <input type="hidden" name="id" value={project.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      type="submit"
                      disabled={index === 0}
                      aria-label={`Monter « ${project.title_fr} »`}
                      className={buttonClass.icon}
                    >
                      ↑
                    </button>
                  </form>
                  <form action={moveProject}>
                    <input type="hidden" name="id" value={project.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      disabled={index === projects.length - 1}
                      aria-label={`Descendre « ${project.title_fr} »`}
                      className={buttonClass.icon}
                    >
                      ↓
                    </button>
                  </form>
                </div>

                <div
                  className={`relative aspect-video w-[120px] flex-none overflow-hidden rounded-[4px] bg-noir ${
                    project.published ? '' : 'opacity-50'
                  }`}
                >
                  {project.youtube_id ? (
                    <Image
                      src={youTubeThumbnailUrl(project.youtube_id, 'mqdefault')}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold tracking-[.14em] text-orange uppercase">
                      SoundCloud
                    </span>
                  )}
                </div>

                <div className="min-w-[200px] flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-anthracite px-2 py-0.5 text-[10px] font-bold tracking-[.14em] uppercase">
                      {project.kind === 'audio' ? 'Audio' : 'Vidéo'}
                    </span>
                    {project.featured ? (
                      <span className="rounded-full bg-orange px-2 py-0.5 text-[10px] font-bold tracking-[.14em] text-noir uppercase">
                        Accueil
                      </span>
                    ) : null}
                    {!project.published ? (
                      <span className="rounded-full bg-anthracite px-2 py-0.5 text-[10px] font-bold tracking-[.14em] uppercase">
                        Non publié
                      </span>
                    ) : null}
                  </div>
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="mt-1 block text-[15px] font-bold hover:text-orange"
                  >
                    {project.title_fr}
                    {project.client ? (
                      <span className="font-normal text-muted"> / {project.client}</span>
                    ) : null}
                  </Link>
                  <p className="m-0 mt-0.5 text-[12px] text-muted">
                    {labels.length ? labels.join(' · ') : 'Aucune catégorie'}
                    {project.kind === 'audio' && project.duration_seconds != null
                      ? ` — ${formatDuration(project.duration_seconds)}`
                      : ''}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <form action={setProjectPublished}>
                    <input type="hidden" name="id" value={project.id} />
                    <input type="hidden" name="published" value={String(!project.published)} />
                    <button type="submit" className={buttonClass.secondary}>
                      {project.published ? 'Masquer' : 'Publier'}
                    </button>
                  </form>
                  <form action={setProjectFeatured}>
                    <input type="hidden" name="id" value={project.id} />
                    <input type="hidden" name="featured" value={String(!project.featured)} />
                    <button
                      type="submit"
                      aria-pressed={project.featured}
                      aria-label={`${project.featured ? 'Retirer de' : 'Mettre sur'} l’accueil « ${project.title_fr} »`}
                      className={buttonClass.secondary}
                    >
                      {project.featured ? '★ Accueil' : '☆ Accueil'}
                    </button>
                  </form>
                  <Link href={`/admin/projects/${project.id}`} className={buttonClass.secondary}>
                    Modifier
                  </Link>
                  <form action={deleteProject}>
                    <input type="hidden" name="id" value={project.id} />
                    <ConfirmSubmit ariaLabel={`Supprimer « ${project.title_fr} »`} />
                  </form>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </>
  );
}
