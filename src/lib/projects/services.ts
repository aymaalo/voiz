/**
 * The credits vocabulary for project cards ("Sound Direction · Sound Design ·
 * Mix"). Kept in English on both locales, as the studio writes them. The ids
 * are mirrored by the check constraint on projects.services — add a value in
 * both places.
 */
export const PROJECT_SERVICES = [
  { id: 'sound-direction', label: 'Sound Direction' },
  { id: 'sound-design', label: 'Sound Design' },
  { id: 'original-music', label: 'Original Music' },
  { id: 'foley', label: 'Foley' },
  { id: 'dialogue-editing', label: 'Dialogue Editing' },
  { id: 'mix', label: 'Mix' },
  { id: 'mastering', label: 'Mastering' },
] as const;

export type ProjectServiceId = (typeof PROJECT_SERVICES)[number]['id'];

export const PROJECT_SERVICE_IDS = PROJECT_SERVICES.map((s) => s.id) as [
  ProjectServiceId,
  ...ProjectServiceId[],
];

/** Labels in the canonical order, whatever order they were ticked in. */
export function serviceLabels(ids: readonly string[]): string[] {
  return PROJECT_SERVICES.filter((s) => ids.includes(s.id)).map((s) => s.label);
}
