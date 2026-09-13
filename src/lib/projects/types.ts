/** Shapes the public site renders — already localised for one locale. */

export const PROJECTS_CACHE_TAG = 'projects';

export type ProjectKind = 'video' | 'audio';

export type TagView = {
  id: string;
  label: string;
};

export type ProjectView = {
  id: string;
  kind: ProjectKind;
  title: string;
  /** Empty when not set; rendered as "Title / Client". */
  client: string;
  description: string;
  /** Label above the title: the first tag, or the kind when untagged. */
  kicker: string;
  /** Credit labels in canonical order, e.g. ["Sound Direction", "Mix"]. */
  services: string[];
  tagIds: string[];
  /** Always set for videos; audio may play from SoundCloud instead. */
  youtubeId: string | null;
  /** When set on an audio project, the tile plays SoundCloud. */
  soundcloudUrl: string | null;
  /** YouTube still, or null for SoundCloud-only audio. */
  thumbnailSrc: string | null;
  /** Formatted ("3:42"), or null when unknown. */
  duration: string | null;
};
