import { tDynamic } from '@/core/i18n/dynamic';

export interface TattooStyleFaq {
  q: string;
  a: string;
  linkHref?: string;
  linkLabel?: string;
}

export interface TattooStyleLocalized {
  name: string;
  seoTitle: string;
  seoDescription: string;
  heroTitle: string;
  heroSubtitle: string;
  defaultPromptPlaceholder: string;
  promptIdeas: string[];
  characteristics: string;
  bestPlacements: string[];
  placementNotes: string;
  longevityTips: string;
  faqs: TattooStyleFaq[];
}

export interface TattooStylePage {
  slug: string;
  i18nKey: string;
  heroStyleId: string;
  image: string;
  promptCount: number;
  placementCount: number;
  faqLinks: (string | null)[];
  relatedStyleSlugs: string[];
}

export const TATTOO_STYLES: TattooStylePage[] = [
  {
    "slug": "fine-line",
    "i18nKey": "style_page.fine_line",
    "heroStyleId": "fine-line",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/fine-line.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      "/tattoo-price-calculator",
      "/tattoo-try-on"
    ],
    "relatedStyleSlugs": [
      "minimalist",
      "single-needle",
      "floral",
      "micro-realism"
    ]
  },
  {
    "slug": "minimalist",
    "i18nKey": "style_page.minimalist",
    "heroStyleId": "minimalist",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/minimalist.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      null,
      "/tattoo-price-calculator"
    ],
    "relatedStyleSlugs": [
      "fine-line",
      "single-needle",
      "lettering",
      "geometric"
    ]
  },
  {
    "slug": "floral",
    "i18nKey": "style_page.floral",
    "heroStyleId": "fine-line",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/floral.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      null,
      "/tattoo-price-calculator"
    ],
    "relatedStyleSlugs": [
      "fine-line",
      "minimalist",
      "single-needle",
      "watercolor"
    ]
  },
  {
    "slug": "lettering",
    "i18nKey": "style_page.lettering",
    "heroStyleId": "lettering",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/lettering.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      "/tattoo-font-generator",
      "/tattoo-price-calculator"
    ],
    "relatedStyleSlugs": [
      "minimalist",
      "chicano",
      "fine-line",
      "blackwork"
    ]
  },
  {
    "slug": "realism",
    "i18nKey": "style_page.realism",
    "heroStyleId": "realism",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/realism.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      null,
      "/tattoo-price-calculator"
    ],
    "relatedStyleSlugs": [
      "black-grey",
      "micro-realism",
      "neo-traditional",
      "chicano"
    ]
  },
  {
    "slug": "black-grey",
    "i18nKey": "style_page.black_grey",
    "heroStyleId": "black-grey",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/black-grey.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      "/tattoo-price-calculator",
      null
    ],
    "relatedStyleSlugs": [
      "realism",
      "chicano",
      "micro-realism",
      "blackwork"
    ]
  },
  {
    "slug": "american-traditional",
    "i18nKey": "style_page.american_traditional",
    "heroStyleId": "american-traditional",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/old-school.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      null,
      "/tattoo-price-calculator"
    ],
    "relatedStyleSlugs": [
      "neo-traditional",
      "japanese",
      "blackwork",
      "patch"
    ]
  },
  {
    "slug": "japanese",
    "i18nKey": "style_page.japanese",
    "heroStyleId": "japanese",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/japanese.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      "/tattoo-price-calculator",
      null
    ],
    "relatedStyleSlugs": [
      "american-traditional",
      "neo-traditional",
      "blackwork",
      "anime"
    ]
  },
  {
    "slug": "blackwork",
    "i18nKey": "style_page.blackwork",
    "heroStyleId": "blackwork",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/blackwork.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      null,
      "/tattoo-price-calculator"
    ],
    "relatedStyleSlugs": [
      "dotwork",
      "geometric",
      "tribal",
      "ornamental"
    ]
  },
  {
    "slug": "geometric",
    "i18nKey": "style_page.geometric",
    "heroStyleId": "geometric",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/geometric.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      null,
      "/tattoo-price-calculator"
    ],
    "relatedStyleSlugs": [
      "mandala",
      "dotwork",
      "minimalist",
      "blackwork"
    ]
  },
  {
    "slug": "neo-traditional",
    "i18nKey": "style_page.neo_traditional",
    "heroStyleId": "neo-traditional",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/neo-traditional.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      null,
      "/tattoo-price-calculator"
    ],
    "relatedStyleSlugs": [
      "american-traditional",
      "illustrative",
      "japanese",
      "realism"
    ]
  },
  {
    "slug": "micro-realism",
    "i18nKey": "style_page.micro_realism",
    "heroStyleId": "micro-realism",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/micro-realism.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      "/tattoo-price-calculator",
      null
    ],
    "relatedStyleSlugs": [
      "realism",
      "single-needle",
      "fine-line",
      "black-grey"
    ]
  },
  {
    "slug": "watercolor",
    "i18nKey": "style_page.watercolor",
    "heroStyleId": "watercolor",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/watercolor.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      null,
      "/tattoo-try-on"
    ],
    "relatedStyleSlugs": [
      "floral",
      "illustrative",
      "fine-line",
      "neo-traditional"
    ]
  },
  {
    "slug": "dotwork",
    "i18nKey": "style_page.dotwork",
    "heroStyleId": "dotwork",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/dotwork.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      null,
      "/tattoo-price-calculator"
    ],
    "relatedStyleSlugs": [
      "mandala",
      "geometric",
      "ornamental",
      "blackwork"
    ]
  },
  {
    "slug": "ornamental",
    "i18nKey": "style_page.ornamental",
    "heroStyleId": "ornamental",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/ornamental.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      null,
      "/tattoo-price-calculator"
    ],
    "relatedStyleSlugs": [
      "mandala",
      "dotwork",
      "blackwork",
      "fine-line"
    ]
  },
  {
    "slug": "anime",
    "i18nKey": "style_page.anime",
    "heroStyleId": "anime",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/anime.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      "/tattoo-price-calculator",
      null,
      null
    ],
    "relatedStyleSlugs": [
      "illustrative",
      "japanese",
      "blackwork",
      "neo-traditional"
    ]
  },
  {
    "slug": "illustrative",
    "i18nKey": "style_page.illustrative",
    "heroStyleId": "illustrative",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/illustrative.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      null,
      "/tattoo-price-calculator"
    ],
    "relatedStyleSlugs": [
      "neo-traditional",
      "anime",
      "blackwork",
      "watercolor"
    ]
  },
  {
    "slug": "tribal",
    "i18nKey": "style_page.tribal",
    "heroStyleId": "tribal",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/tribal.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      "/tattoo-try-on",
      null,
      null
    ],
    "relatedStyleSlugs": [
      "blackwork",
      "geometric",
      "ornamental",
      "cybersigilism"
    ]
  },
  {
    "slug": "chicano",
    "i18nKey": "style_page.chicano",
    "heroStyleId": "chicano",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/chicano.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      null,
      "/tattoo-font-generator"
    ],
    "relatedStyleSlugs": [
      "black-grey",
      "lettering",
      "realism",
      "fine-line"
    ]
  },
  {
    "slug": "mandala",
    "i18nKey": "style_page.mandala",
    "heroStyleId": "mandala",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/mandala.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      null,
      "/tattoo-price-calculator"
    ],
    "relatedStyleSlugs": [
      "geometric",
      "dotwork",
      "ornamental",
      "blackwork"
    ]
  },
  {
    "slug": "single-needle",
    "i18nKey": "style_page.single_needle",
    "heroStyleId": "single-needle",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/single-needle.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      null,
      "/tattoo-price-calculator"
    ],
    "relatedStyleSlugs": [
      "fine-line",
      "micro-realism",
      "minimalist",
      "floral"
    ]
  },
  {
    "slug": "patch",
    "i18nKey": "style_page.patch",
    "heroStyleId": "patch",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/patch-sticker.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      null,
      "/tattoo-price-calculator"
    ],
    "relatedStyleSlugs": [
      "realism",
      "illustrative",
      "american-traditional",
      "anime"
    ]
  },
  {
    "slug": "cybersigilism",
    "i18nKey": "style_page.cybersigilism",
    "heroStyleId": "cybersigilism",
    "image": "https://assets.tattoogenerator.online/v1/assets/styles/cybersigilism.webp",
    "promptCount": 4,
    "placementCount": 5,
    "faqLinks": [
      null,
      null,
      "/tattoo-try-on"
    ],
    "relatedStyleSlugs": [
      "tribal",
      "blackwork",
      "ornamental",
      "fine-line"
    ]
  }
];

export const TATTOO_STYLES_BY_SLUG: Record<string, TattooStylePage> =
  Object.fromEntries(TATTOO_STYLES.map((s) => [s.slug, s]));

export function getTattooStyleBySlug(slug: string): TattooStylePage | undefined {
  return TATTOO_STYLES_BY_SLUG[slug];
}

export function getLocalizedStyle(
  style: TattooStylePage,
  locale?: 'en' | 'zh'
): TattooStyleLocalized {
  const opts = locale ? { locale } : undefined;
  const p = style.i18nKey;
  return {
    name: tDynamic(`${p}.name`, undefined, opts),
    seoTitle: tDynamic(`${p}.seo_title`, undefined, opts),
    seoDescription: tDynamic(`${p}.seo_desc`, undefined, opts),
    heroTitle: tDynamic(`${p}.hero_title`, undefined, opts),
    heroSubtitle: tDynamic(`${p}.hero_subtitle`, undefined, opts),
    defaultPromptPlaceholder: tDynamic(`${p}.placeholder`, undefined, opts),
    promptIdeas: Array.from({ length: style.promptCount }, (_, i) =>
      tDynamic(`${p}.prompt_${i + 1}`, undefined, opts)
    ),
    characteristics: tDynamic(`${p}.characteristics`, undefined, opts),
    bestPlacements: Array.from({ length: style.placementCount }, (_, i) =>
      tDynamic(`${p}.placement_${i + 1}`, undefined, opts)
    ),
    placementNotes: tDynamic(`${p}.placement_notes`, undefined, opts),
    longevityTips: tDynamic(`${p}.longevity_tips`, undefined, opts),
    faqs: style.faqLinks.map((linkHref, i) => ({
      q: tDynamic(`${p}.faq_${i + 1}_q`, undefined, opts),
      a: tDynamic(`${p}.faq_${i + 1}_a`, undefined, opts),
      ...(linkHref
        ? {
            linkHref,
            linkLabel: tDynamic(`${p}.faq_${i + 1}_link`, undefined, opts),
          }
        : {}),
    })),
  };
}
