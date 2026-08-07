const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")";

/* Soft blobs in the brand palette. Two fields rotate against each other so the
   overlaps keep shifting instead of repeating a fixed pattern. */
const FIELD_A = [
  'radial-gradient(38% 42% at 22% 28%, rgba(255,83,0,.17) 0%, transparent 70%)',
  'radial-gradient(34% 38% at 78% 20%, rgba(63,63,63,.34) 0%, transparent 72%)',
  'radial-gradient(46% 40% at 62% 76%, rgba(255,83,0,.12) 0%, transparent 70%)',
].join(',');

const FIELD_B = [
  'radial-gradient(42% 46% at 30% 70%, rgba(255,83,0,.11) 0%, transparent 72%)',
  'radial-gradient(36% 40% at 74% 58%, rgba(230,231,226,.08) 0%, transparent 70%)',
  'radial-gradient(50% 44% at 12% 24%, rgba(63,63,63,.28) 0%, transparent 74%)',
].join(',');

/**
 * A slowly moving gradient field, plus two drifting orange glows, behind the
 * page content. Each field is sized at 200% and offset by -50% so rotation
 * never swings an empty corner into view.
 */
export function LivingBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute top-[-50%] left-[-50%] h-[200%] w-[200%]"
        style={{
          backgroundImage: FIELD_A,
          animation: 'vz-drift-a 44s ease-in-out infinite',
          willChange: 'transform',
        }}
      />
      <div
        className="absolute top-[-50%] left-[-50%] h-[200%] w-[200%]"
        style={{
          backgroundImage: FIELD_B,
          animation: 'vz-drift-b 70s ease-in-out infinite, vz-breathe 14s ease-in-out infinite',
          willChange: 'transform, opacity',
        }}
      />
      <div
        className="absolute top-[10%] left-[-15%] h-[55vw] w-[55vw] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,83,0,.13) 0%, transparent 65%)',
          animation: 'vz-glow 11s ease-in-out infinite',
        }}
      />
      <div
        className="absolute right-[-12%] bottom-[-10%] h-[60vw] w-[60vw] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,83,0,.11) 0%, transparent 65%)',
          animation: 'vz-glow2 15s ease-in-out infinite',
        }}
      />
    </div>
  );
}

/** Fixed film-grain overlay sitting above everything. */
export function FilmGrain() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-60 opacity-5"
      style={{ backgroundImage: GRAIN }}
    />
  );
}
