type MarqueeProps = {
  words: string[];
  variant?: 'orange' | 'ivoire';
};

/**
 * Edge-to-edge ticker. The word sequence is duplicated and the track is animated
 * 0 → -50%, so the loop is seamless.
 */
export function Marquee({ words, variant = 'orange' }: MarqueeProps) {
  const sequence = words.map((w) => `${w} ◎ `).join('');

  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden py-[14px] whitespace-nowrap text-noir ${
        variant === 'orange' ? 'bg-orange' : 'bg-ivoire'
      }`}
    >
      <div className="inline-block animate-[vz-marquee_28s_linear_infinite] text-[13px] font-bold tracking-[.22em] uppercase md:text-[15px]">
        {sequence}
        {sequence}
      </div>
    </div>
  );
}
