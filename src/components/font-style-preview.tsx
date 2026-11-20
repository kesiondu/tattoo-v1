import { cn } from '@/lib/utils';

/**
 * Decorative font stacks used to render each lettering style as a real
 * typeface (not a picture), so the user can see what the font looks like.
 * Keys match FontStyleDef.id in the font generator.
 */
export const PREVIEW_FONTS: Record<string, string> = {
  generic: "'Nunito Variable', sans-serif",
  classic: "'Libre Baskerville', Georgia, serif",
  minimalist: "'Syne Variable', sans-serif",
  cursive: "'Dancing Script', cursive",
  handwritten: "'Caveat', cursive",
  calligraphy: "'Great Vibes', cursive",
  block: "'Archivo Black', sans-serif",
  stencil: "'Stardos Stencil', cursive",
  typewriter: "'Special Elite', monospace",
  chicano: "'Mr Dafoe', cursive",
  gangster: "'Pirata One', cursive",
  graffiti: "'Permanent Marker', cursive",
  roman: "'Cinzel', serif",
  blackletter: "'UnifrakturCook', cursive",
  'old-english': "'UnifrakturMaguntia', cursive",
  traditional: "'Archivo Black', sans-serif",
  western: "'Rye', cursive",
  script: "'Great Vibes', cursive",
  gothic: "'Pirata One', cursive",
  dark: "'Nosifer', cursive",
};

/** Short words shown in the preview cards (long examples are truncated). */
export const PREVIEW_WORDS: Record<string, string> = {
  generic: 'Luna',
  classic: 'Time',
  minimalist: 'let go',
  cursive: 'Always',
  handwritten: 'te amo',
  calligraphy: 'Grace',
  block: 'BOLD',
  stencil: '1987',
  typewriter: 'It is',
  chicano: 'Loyalty',
  gangster: 'Real ones',
  graffiti: 'Rebel',
  roman: 'AMOR',
  blackletter: 'Born free',
  'old-english': 'No Risk',
  traditional: 'MOM',
  western: 'Ace',
  script: 'Angel',
  gothic: 'DIVINE',
  dark: 'Flesh & bone',
};

interface FontStylePreviewProps {
  styleId: string;
  /** Already-localised label rendered under the specimen */
  label: string;
  active: boolean;
  onClick: () => void;
  /** Overrides for a font chosen from the 500-font library dialog */
  fontFamily?: string;
  word?: string;
}

export function FontStylePreview({
  styleId,
  label,
  active,
  onClick,
  fontFamily: familyOverride,
  word: wordOverride,
}: FontStylePreviewProps) {
  const fontFamily = familyOverride ?? PREVIEW_FONTS[styleId] ?? PREVIEW_FONTS.generic;
  const word = wordOverride ?? PREVIEW_WORDS[styleId] ?? PREVIEW_WORDS.generic;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group flex flex-col overflow-hidden rounded-lg border bg-white transition-all',
        active
          ? 'border-foreground ring-1 ring-foreground'
          : 'border-border hover:border-foreground/40'
      )}
    >
      <span className="flex h-14 items-center justify-center overflow-hidden px-1.5">
        <span
          className="block max-w-full truncate text-center text-[26px] leading-none text-foreground"
          style={{ fontFamily }}
        >
          {word}
        </span>
      </span>
      <span
        className={cn(
          'block truncate border-t px-2 py-1.5 text-center text-[10px] font-medium',
          active
            ? 'border-foreground bg-foreground text-background'
            : 'border-border text-muted-foreground group-hover:text-foreground'
        )}
      >
        {label}
      </span>
    </button>
  );
}
