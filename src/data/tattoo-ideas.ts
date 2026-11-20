import { tDynamic } from '@/core/i18n/dynamic';

export interface TattooIdeaLocalized {
  title: string;
  imageAlt: string;
  placement: string;
  recommendedSize: string;
  painLevel: string;
  estimatedCost: string;
  symbolism: string;
  placementGuide: string;
  artistTips: string;
}

export interface TattooIdeaPage {
  slug: string;
  i18nKey: string;
  styleSlug: string;
  artworkUrl: string;
  bodyUrl: string;
  imageWidth: number;
  imageHeight: number;
  prompt: string;
  relatedIdeaSlugs: string[];
}

export const LEGACY_TATTOO_IDEA_SLUGS: Record<string, string> = {
  'cybersigilism-tattoo-36': 'cybersigilism-shoulder-arm-tattoo',
  'mandala-tattoo-112': 'mandala-hip-tattoo',
};

export const TATTOO_IDEAS: TattooIdeaPage[] = [
  {
    "slug": "rib-calligraphy-tattoo",
    "i18nKey": "idea_page.rib_calligraphy_tattoo",
    "styleSlug": "lettering",
    "artworkUrl": "/gallery/rib-calligraphy-tattoo-artwork.webp",
    "bodyUrl": "/gallery/rib-calligraphy-tattoo-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Delicate flowing black calligraphy script quote curving gracefully along the side ribcage, thin fine-line flourishes, balanced letter spacing, clean skin negative space, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "hand-calligraphy-tattoo",
      "chest-blackletter-tattoo",
      "fine-line-decorative-star-tattoo",
      "cherry-blossom-tattoo"
    ]
  },
  {
    "slug": "cybersigilism-shoulder-arm-tattoo",
    "i18nKey": "idea_page.cybersigilism_tattoo_36",
    "styleSlug": "cybersigilism",
    "artworkUrl": "/gallery/cybersigilism-tattoo-36-artwork.webp",
    "bodyUrl": "/gallery/cybersigilism-tattoo-36-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Razor-sharp black cybersigilism neo-tribal sigil flowing across the upper arm and shoulder, slender tapered spikes, organic web-like negative space, crisp black ink linework, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "cybersigilism-tattoo",
      "blackwork-leaf-tattoo",
      "dotwork-eye-tattoo-with-moth-wings",
      "geometric-hexagon-tattoo"
    ]
  },
  {
    "slug": "ornamental-flower-tattoo",
    "i18nKey": "idea_page.ornamental_flower_tattoo",
    "styleSlug": "ornamental",
    "artworkUrl": "/gallery/ornamental-flower-tattoo-artwork.webp",
    "bodyUrl": "/gallery/ornamental-flower-tattoo-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Symmetrical ornamental botanical flower medallion with delicate filigree curls and stippled dotwork petals curving along the upper thigh, crisp black linework, airy negative space, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "mandala-hip-tattoo",
      "fine-line-decorative-star-tattoo",
      "cherry-blossom-tattoo",
      "dotwork-eye-tattoo-with-moth-wings"
    ]
  },
  {
    "slug": "japanese-fox-and-kitsune-mask-tattoo",
    "i18nKey": "idea_page.japanese_fox_and_kitsune_mask_tattoo",
    "styleSlug": "japanese",
    "artworkUrl": "/gallery/japanese-fox-and-kitsune-mask-tattoo-artwork.webp",
    "bodyUrl": "/gallery/japanese-fox-and-kitsune-mask-tattoo-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Traditional Japanese kitsune fox mask surrounded by crimson markings, swirling wind clouds, and autumn leaves, bold Irezumi black outlines and vivid red accents, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "phoenix-tattoo-with-flowers",
      "american-traditional-dagger-and-rose-tattoo",
      "chicano-female-portrait-and-rose-tattoo",
      "blackwork-leaf-tattoo"
    ]
  },
  {
    "slug": "minimalist-cat-tattoo",
    "i18nKey": "idea_page.minimalist_cat_tattoo",
    "styleSlug": "minimalist",
    "artworkUrl": "/gallery/minimalist-cat-tattoo-artwork.webp",
    "bodyUrl": "/gallery/minimalist-cat-tattoo-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Minimalist clean black line-art sitting cat silhouette with graceful curved tail on the shoulder blade, pure open negative space, subtle delicate contour, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "minimalist-fox-finger-tattoo",
      "minimalist-human-figure-and-butterfly-tattoo",
      "fine-line-ribbon-bow-tattoo",
      "single-needle-scissors-tattoo"
    ]
  },
  {
    "slug": "cherry-blossom-tattoo",
    "i18nKey": "idea_page.cherry_blossom_tattoo",
    "styleSlug": "fine-line",
    "artworkUrl": "/gallery/cherry-blossom-tattoo-artwork.webp",
    "bodyUrl": "/gallery/cherry-blossom-tattoo-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Delicate fine line cherry blossom branch wrapping gracefully from the inner wrist onto the side of the hand, soft crimson petal accents, crisp single-needle black ink linework, natural skin contour flow, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "ornamental-flower-tattoo",
      "watercolor-flower-tattoo",
      "fine-line-ribbon-bow-tattoo",
      "fine-line-decorative-star-tattoo"
    ]
  },
  {
    "slug": "mandala-hip-tattoo",
    "i18nKey": "idea_page.mandala_tattoo_112",
    "styleSlug": "mandala",
    "artworkUrl": "/gallery/mandala-tattoo-112-artwork.webp",
    "bodyUrl": "/gallery/mandala-tattoo-112-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Intricate symmetrical circular mandala tattoo with layered lotus petals, geometric dotwork lace, and fine ornamental bead tips on the side hip, crisp black ink, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "ornamental-flower-tattoo",
      "geometric-hexagon-tattoo",
      "dotwork-eye-tattoo-with-moth-wings",
      "fine-line-decorative-star-tattoo"
    ]
  },
  {
    "slug": "fine-line-decorative-star-tattoo",
    "i18nKey": "idea_page.fine_line_decorative_star_tattoo",
    "styleSlug": "fine-line",
    "artworkUrl": "/gallery/fine-line-decorative-star-tattoo-artwork.webp",
    "bodyUrl": "/gallery/fine-line-decorative-star-tattoo-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Delicate fine line celestial four-point decorative starburst with sparkling micro dots and thin symmetrical rays on the collarbone, minimalist black ink, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "fine-line-ribbon-bow-tattoo",
      "cherry-blossom-tattoo",
      "minimalist-cat-tattoo",
      "ornamental-flower-tattoo"
    ]
  },
  {
    "slug": "hand-calligraphy-tattoo",
    "i18nKey": "idea_page.hand_calligraphy_tattoo",
    "styleSlug": "lettering",
    "artworkUrl": "/gallery/hand-calligraphy-tattoo-artwork.webp",
    "bodyUrl": "/gallery/hand-calligraphy-tattoo-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Ornate Chicano-inspired black calligraphy lettering across the back of the hand, dramatic sweeping swashes, crisp ink linework, balanced spacing, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "rib-calligraphy-tattoo",
      "chest-blackletter-tattoo",
      "chicano-female-portrait-and-rose-tattoo",
      "cherry-blossom-tattoo"
    ]
  },
  {
    "slug": "geometric-hexagon-tattoo",
    "i18nKey": "idea_page.geometric_hexagon_tattoo",
    "styleSlug": "geometric",
    "artworkUrl": "/gallery/geometric-07-artwork.webp",
    "bodyUrl": "/gallery/geometric-07-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Interlocking sacred geometry hexagon grid cascading down the lower leg and calf, crisp straight black lines with subtle dotwork shading gradients, modern architectural tattoo photography",
    "relatedIdeaSlugs": [
      "mandala-hip-tattoo",
      "dotwork-eye-tattoo-with-moth-wings",
      "blackwork-leaf-tattoo",
      "cybersigilism-tattoo-36"
    ]
  },
  {
    "slug": "single-needle-scissors-tattoo",
    "i18nKey": "idea_page.single_needle_scissors_tattoo",
    "styleSlug": "single-needle",
    "artworkUrl": "/gallery/single-needle-artwork.webp",
    "bodyUrl": "/gallery/single-needle-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Ultra-delicate single-needle vintage tailor scissors with ornate engraved handles and fine micro shading on the inner forearm, crisp 1RL black ink linework, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "fine-line-ribbon-bow-tattoo",
      "minimalist-cat-tattoo",
      "fine-line-decorative-star-tattoo",
      "minimalist-human-figure-and-butterfly-tattoo"
    ]
  },
  {
    "slug": "fine-line-ribbon-bow-tattoo",
    "i18nKey": "idea_page.fine_line_ribbon_bow_tattoo",
    "styleSlug": "fine-line",
    "artworkUrl": "/gallery/fine-line-ribbon-artwork.webp",
    "bodyUrl": "/gallery/fine-line-ribbon-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Delicate fine line coquette silk ribbon bow with softly flowing trailing ends and whisper-light stipple shading on the upper arm, crisp black ink, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "fine-line-decorative-star-tattoo",
      "cherry-blossom-tattoo",
      "single-needle-scissors-tattoo",
      "minimalist-cat-tattoo"
    ]
  },
  {
    "slug": "watercolor-flower-tattoo",
    "i18nKey": "idea_page.watercolor_flower_tattoo",
    "styleSlug": "watercolor",
    "artworkUrl": "/dialog-examples/watercolor-paper.webp",
    "bodyUrl": "/dialog-examples/watercolor-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Painterly watercolor blooming flower with translucent coral, violet, and teal paint washes anchored by delicate black fine-line botanical outlines, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "watercolor-hummingbird-tattoo",
      "cherry-blossom-tattoo",
      "ornamental-flower-tattoo",
      "phoenix-tattoo-with-flowers"
    ]
  },
  {
    "slug": "black-and-grey-hummingbird-and-flower-tattoo",
    "i18nKey": "idea_page.black_and_grey_hummingbird_and_flower_tattoo",
    "styleSlug": "black-grey",
    "artworkUrl": "/dialog-examples/bird-paper.webp",
    "bodyUrl": "/dialog-examples/bird-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Black and grey realism hummingbird hovering mid-flight beside a blooming flower, silky smooth grey-wash feather shading, bright open-skin highlights, realistic forearm tattoo photography",
    "relatedIdeaSlugs": [
      "watercolor-hummingbird-tattoo",
      "chicano-female-portrait-and-rose-tattoo",
      "phoenix-tattoo-with-flowers",
      "cherry-blossom-tattoo"
    ]
  },
  {
    "slug": "minimalist-fox-finger-tattoo",
    "i18nKey": "idea_page.minimalist_fox_finger_tattoo",
    "styleSlug": "minimalist",
    "artworkUrl": "/dialog-examples/fox-paper.webp",
    "bodyUrl": "/dialog-examples/fox-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Tiny minimalist origami-inspired fox head in crisp clean black lines placed neatly on the finger, pure open negative space, subtle geometric simplicity, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "minimalist-cat-tattoo",
      "minimalist-human-figure-and-butterfly-tattoo",
      "fine-line-decorative-star-tattoo",
      "hand-calligraphy-tattoo"
    ]
  },
  {
    "slug": "phoenix-tattoo-with-flowers",
    "i18nKey": "idea_page.phoenix_tattoo_with_flowers",
    "styleSlug": "illustrative",
    "artworkUrl": "/home-values/phoenix-clean-artwork.webp",
    "bodyUrl": "/home-values/phoenix-body-original.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Majestic illustrative phoenix rising with sweeping feathered tail and blooming peonies, expressive ink linework with rich tonal contrast, sweeping vertical back or shoulder composition, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "japanese-fox-and-kitsune-mask-tattoo",
      "black-and-grey-hummingbird-and-flower-tattoo",
      "american-traditional-dagger-and-rose-tattoo",
      "ornamental-flower-tattoo"
    ]
  },
  {
    "slug": "chest-blackletter-tattoo",
    "i18nKey": "idea_page.chest_blackletter_tattoo",
    "styleSlug": "lettering",
    "artworkUrl": "/tattoo-how-it-works/clean-artwork.webp",
    "bodyUrl": "/tattoo-how-it-works/body-preview.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Bold gothic Old English blackletter lettering spanning symmetrically across the upper chest, razor-sharp angular serifs and clean negative space, solid black ink, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "hand-calligraphy-tattoo",
      "rib-calligraphy-tattoo",
      "chicano-female-portrait-and-rose-tattoo",
      "american-traditional-dagger-and-rose-tattoo"
    ]
  },
  {
    "slug": "dotwork-eye-tattoo-with-moth-wings",
    "i18nKey": "idea_page.dotwork_eye_tattoo_with_moth_wings",
    "styleSlug": "dotwork",
    "artworkUrl": "/gallery/dotwork-eye-artwork.webp",
    "bodyUrl": "/gallery/dotwork-eye-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Mystical dotwork all-seeing eye framed by symmetrical moth wings and stippled geometric rays on the forearm, pure black ink pepper shading, crisp outlines, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "mandala-hip-tattoo",
      "geometric-hexagon-tattoo",
      "ornamental-flower-tattoo",
      "blackwork-leaf-tattoo"
    ]
  },
  {
    "slug": "minimalist-human-figure-and-butterfly-tattoo",
    "i18nKey": "idea_page.minimalist_human_figure_and_butterfly_tattoo",
    "styleSlug": "minimalist",
    "artworkUrl": "/gallery/minimalist-butterfly-artwork.webp",
    "bodyUrl": "/gallery/minimalist-butterfly-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Minimalist continuous fine-line human silhouette releasing a delicate butterfly, poetic open negative space, crisp thin black ink lines on the forearm, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "minimalist-cat-tattoo",
      "fine-line-ribbon-bow-tattoo",
      "single-needle-scissors-tattoo",
      "minimalist-fox-finger-tattoo"
    ]
  },
  {
    "slug": "blackwork-leaf-tattoo",
    "i18nKey": "idea_page.blackwork_leaf_tattoo",
    "styleSlug": "blackwork",
    "artworkUrl": "/gallery/blackwork-leaf-artwork.webp",
    "bodyUrl": "/gallery/blackwork-leaf-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Bold graphic blackwork botanical leaf branch with solid pure black fills and crisp negative-space veins wrapping cleanly along the forearm, high-contrast tattoo photography",
    "relatedIdeaSlugs": [
      "cybersigilism-shoulder-arm-tattoo",
      "cybersigilism-tattoo",
      "geometric-hexagon-tattoo",
      "ornamental-flower-tattoo"
    ]
  },
  {
    "slug": "cybersigilism-tattoo",
    "i18nKey": "idea_page.cybersigilism_tattoo",
    "styleSlug": "cybersigilism",
    "artworkUrl": "/gallery/cybersigilism-back-artwork.webp",
    "bodyUrl": "/gallery/cybersigilism-back-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Sweeping symmetrical black cybersigilism wing sigil stretching across the upper back and tapering down the spine, razor-thin neo-tribal spikes, high-contrast black ink, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "cybersigilism-shoulder-arm-tattoo",
      "blackwork-leaf-tattoo",
      "mandala-hip-tattoo",
      "ornamental-flower-tattoo"
    ]
  },
  {
    "slug": "american-traditional-dagger-and-rose-tattoo",
    "i18nKey": "idea_page.american_traditional_dagger_and_rose_tattoo",
    "styleSlug": "american-traditional",
    "artworkUrl": "/gallery/american-traditional-dagger-artwork.webp",
    "bodyUrl": "/gallery/american-traditional-dagger-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Classic American Traditional Old School dagger piercing a bold crimson rose, thick uniform black outlines, saturated red, gold, and emerald ink with heavy black whip shading, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "japanese-fox-and-kitsune-mask-tattoo",
      "chest-blackletter-tattoo",
      "phoenix-tattoo-with-flowers",
      "chicano-female-portrait-and-rose-tattoo"
    ]
  },
  {
    "slug": "chicano-female-portrait-and-rose-tattoo",
    "i18nKey": "idea_page.chicano_female_portrait_and_rose_tattoo",
    "styleSlug": "chicano",
    "artworkUrl": "/gallery/chicano-portrait-artwork.webp",
    "bodyUrl": "/gallery/chicano-portrait-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Chicano black and grey realism female portrait with blooming rose tucked behind her ear, velvety smooth grey-wash shading, dramatic deep shadows and luminous highlights on the forearm, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "black-and-grey-hummingbird-and-flower-tattoo",
      "hand-calligraphy-tattoo",
      "chest-blackletter-tattoo",
      "japanese-fox-and-kitsune-mask-tattoo"
    ]
  },
  {
    "slug": "watercolor-hummingbird-tattoo",
    "i18nKey": "idea_page.watercolor_hummingbird_tattoo",
    "styleSlug": "watercolor",
    "artworkUrl": "/gallery/watercolor-hummingbird-artwork.webp",
    "bodyUrl": "/gallery/watercolor-hummingbird-body.webp",
    "imageWidth": 1024,
    "imageHeight": 1024,
    "prompt": "Vibrant watercolor hummingbird in mid-flight bursting with turquoise, magenta, and golden brush washes and crisp black ink sketch contours on the shoulder blade, realistic tattoo photography",
    "relatedIdeaSlugs": [
      "watercolor-flower-tattoo",
      "black-and-grey-hummingbird-and-flower-tattoo",
      "phoenix-tattoo-with-flowers",
      "cherry-blossom-tattoo"
    ]
  }
];

export const TATTOO_IDEAS_BY_SLUG: Record<string, TattooIdeaPage> =
  Object.fromEntries(TATTOO_IDEAS.map((i) => [i.slug, i]));

export function getTattooIdeaBySlug(slug: string): TattooIdeaPage | undefined {
  return TATTOO_IDEAS_BY_SLUG[slug];
}

export function getLocalizedIdea(
  idea: TattooIdeaPage,
  locale?: 'en' | 'zh'
): TattooIdeaLocalized {
  const opts = locale ? { locale } : undefined;
  const p = idea.i18nKey;
  return {
    title: tDynamic(`${p}.title`, undefined, opts),
    imageAlt: tDynamic(`${p}.alt`, undefined, opts),
    placement: tDynamic(`${p}.placement`, undefined, opts),
    recommendedSize: tDynamic(`${p}.size`, undefined, opts),
    painLevel: tDynamic(`${p}.pain`, undefined, opts),
    estimatedCost: tDynamic(`${p}.cost`, undefined, opts),
    symbolism: tDynamic(`${p}.symbolism`, undefined, opts),
    placementGuide: tDynamic(`${p}.placement_guide`, undefined, opts),
    artistTips: tDynamic(`${p}.artist_tips`, undefined, opts),
  };
}

export function getIdeasForStyle(styleSlug: string, limit = 8): TattooIdeaPage[] {
  const direct = TATTOO_IDEAS.filter((i) => i.styleSlug === styleSlug);
  if (direct.length >= 4) return direct.slice(0, limit);
  const directSlugs = new Set(direct.map((i) => i.slug));
  const fallback = TATTOO_IDEAS.filter((i) => !directSlugs.has(i.slug));
  return [...direct, ...fallback].slice(0, Math.min(limit, 4));
}
