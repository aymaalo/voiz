import { Inter, Instrument_Serif } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-inter',
  display: 'swap',
});

// The accent face, roman cut only. The brand wanted the serif back but never
// slanted, so the italic is not loaded at all and nothing can reach for it.
export const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'normal',
  variable: '--font-instrument',
  display: 'swap',
});
