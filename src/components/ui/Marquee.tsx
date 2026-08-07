type MarqueeProps = {
  words: string[];
  variant?: 'orange' | 'ivoire';
};

/**
 * Edge-to-edge ticker. The track holds 2 x COPIES sequences and animates
 * 0 -> -50%, so the loop point lands on an identical frame. COPIES keeps each
 * half wider than any viewport — with fewer repeats a wide screen sees the
 * track run out before the loop restarts. Duration scales with COPIES so the
 * pixel speed stays what it was at 2 copies / 28s.
 */
const COPIES = 4;
export function Marquee({ words, variant = 'orange' }: MarqueeProps) {
  const sequence = words.map((w) => `${w} ◎ `).join('');

  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden py-[14px] whitespace-nowrap text-noir ${
        variant === 'orange' ? 'bg-orange' : 'bg-ivoire'
      }`}
    >
      {/* Pausing on hover invites a closer read. */}
      <div className="inline-block animate-[vz-marquee_112s_linear_infinite] text-[13px] font-bold tracking-[.22em] uppercase hover:[animation-play-state:paused] md:text-[15px]">
        {Array.from({ length: COPIES * 2 }, (_, i) => (
          <span key={i}>{sequence}</span>
        ))}
      </div>
    </div>
  );
}
