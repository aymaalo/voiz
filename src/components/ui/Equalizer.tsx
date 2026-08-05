type EqualizerProps = {
  bars?: number;
  height?: number;
  /** Tailwind colour class for the bars. */
  className?: string;
};

/** Four-bar animated equalizer, each bar on its own staggered scaleY loop. */
export function Equalizer({ bars = 4, height = 16, className = 'bg-orange' }: EqualizerProps) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex flex-none items-center gap-[3px]"
      style={{ height }}
    >
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          className={`w-[3px] origin-center ${className}`}
          style={{
            height,
            animation: `vz-eq ${0.7 + i * 0.18}s ease-in-out ${i * 0.1}s infinite`,
          }}
        />
      ))}
    </span>
  );
}
