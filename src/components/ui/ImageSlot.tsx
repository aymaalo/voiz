import Image from 'next/image';

type ImageSlotProps = {
  /** Undefined until the client supplies the artwork. */
  src?: string;
  alt: string;
  /** Copy shown inside the placeholder while `src` is missing. */
  placeholder?: string;
  shape?: 'rect' | 'rounded' | 'circle';
  priority?: boolean;
  sizes?: string;
  className?: string;
};

const SHAPES = {
  rect: 'rounded-none',
  rounded: 'rounded-[4px]',
  circle: 'rounded-full',
} as const;

/**
 * Production stand-in for the prototype's `<image-slot>`. Renders a real
 * optimised image once `src` is set, and a branded placeholder until then —
 * so the layout is never wrong while artwork is still being shot.
 */
export function ImageSlot({
  src,
  alt,
  placeholder,
  shape = 'rect',
  priority = false,
  sizes = '(max-width: 900px) 100vw, 50vw',
  className = '',
}: ImageSlotProps) {
  const shapeClass = SHAPES[shape];

  if (src) {
    return (
      <div className={`relative h-full w-full overflow-hidden ${shapeClass} ${className}`}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={placeholder ?? alt}
      className={`relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden border border-dashed border-anthracite bg-card ${shapeClass} ${className}`}
    >
      <span aria-hidden="true" className="text-[34px] leading-none text-orange/25">
        ◎
      </span>
      {placeholder ? (
        <span className="max-w-[80%] px-2 text-center text-[10px] font-semibold tracking-[.22em] text-muted/70 uppercase">
          {placeholder}
        </span>
      ) : null}
    </div>
  );
}
