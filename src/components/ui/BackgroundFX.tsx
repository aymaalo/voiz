const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Two drifting orange glows behind the page content. */
export function LivingBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute top-[10%] left-[-15%] h-[55vw] w-[55vw] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,83,0,.09) 0%, transparent 65%)',
          animation: 'vz-glow 18s ease-in-out infinite',
        }}
      />
      <div
        className="absolute right-[-12%] bottom-[-10%] h-[60vw] w-[60vw] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255,83,0,.07) 0%, transparent 65%)',
          animation: 'vz-glow2 24s ease-in-out infinite',
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
