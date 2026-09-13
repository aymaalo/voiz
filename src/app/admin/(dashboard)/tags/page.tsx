import type { Metadata } from 'next';
import { deleteTag, moveTag } from '@/app/admin/actions';
import { ConfirmSubmit } from '@/components/admin/ConfirmSubmit';
import { NewTagForm, TagForm } from '@/components/admin/TagForm';
import { buttonClass } from '@/components/admin/ui';
import { requireAdmin } from '@/lib/admin/auth';

export const metadata: Metadata = { title: 'Catégories' };

export default async function AdminTagsPage() {
  const { supabase } = await requireAdmin();
  const { data: tags, error } = await supabase
    .from('tags')
    .select('id, label_fr, label_en, project_tags(count)')
    .order('position')
    .order('id');

  return (
    <>
      <h1 className="m-0 text-[32px] font-black tracking-[-.02em]">Catégories</h1>
      <p className="m-0 mt-1 mb-8 max-w-[640px] text-[14px] text-muted">
        Chaque catégorie utilisée par un projet devient un onglet de filtre, dans cet ordre : sur
        l’accueil, celles des projets mis en avant ; sur la page Projets, toutes. La première
        catégorie d’un projet s’affiche sur sa tuile.
      </p>

      {error ? (
        <p role="alert" className="text-orange">
          Impossible de charger les catégories. Rechargez la page.
        </p>
      ) : (
        <ol className="m-0 mb-10 flex list-none flex-col gap-2 p-0">
          {(tags ?? []).map((tag, index, all) => {
            const count = tag.project_tags[0]?.count ?? 0;
            return (
              <li
                key={tag.id}
                className="flex flex-wrap items-center gap-3 rounded-[6px] border border-anthracite bg-card p-3"
              >
                <div className="flex gap-1">
                  <form action={moveTag}>
                    <input type="hidden" name="id" value={tag.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      type="submit"
                      disabled={index === 0}
                      aria-label={`Monter « ${tag.label_fr} »`}
                      className={buttonClass.icon}
                    >
                      ↑
                    </button>
                  </form>
                  <form action={moveTag}>
                    <input type="hidden" name="id" value={tag.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      disabled={index === all.length - 1}
                      aria-label={`Descendre « ${tag.label_fr} »`}
                      className={buttonClass.icon}
                    >
                      ↓
                    </button>
                  </form>
                </div>

                <TagForm tag={tag} />

                <span className="w-[80px] text-right text-[12px] text-muted tabular-nums">
                  {count} projet{count > 1 ? 's' : ''}
                </span>
                <form action={deleteTag}>
                  <input type="hidden" name="id" value={tag.id} />
                  <ConfirmSubmit
                    ariaLabel={`Supprimer la catégorie « ${tag.label_fr} »`}
                    confirmLabel={count ? `Retirer de ${count} projet${count > 1 ? 's' : ''} ?` : 'Confirmer'}
                  />
                </form>
              </li>
            );
          })}
        </ol>
      )}

      <h2 className="m-0 mb-3 text-[18px] font-bold">Ajouter une catégorie</h2>
      <div className="rounded-[6px] border border-dashed border-anthracite p-3">
        <NewTagForm />
      </div>
    </>
  );
}
