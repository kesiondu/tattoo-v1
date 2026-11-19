import { m } from '@/paraglide/messages.js';

interface ShowcaseValuesProps {
  onOpenAuth?: () => void;
}

const MARQUEE_ROW_1 = [
  {
    src: '/gallery/archangel-warrior-back-tattoo-04.webp',
    alt: 'AI tattoo example 1',
  },
  {
    src: '/gallery/cherry-blossom-hand-wrist-tattoo-02.webp',
    alt: 'AI tattoo example 2',
  },
  {
    src: '/gallery/fine-line-ornamental-rib-tattoo-24.webp',
    alt: 'AI tattoo example 3',
  },
  {
    src: '/gallery/japanese-koi-sleeve-tattoo-11.webp',
    alt: 'AI tattoo example 4',
  },
  {
    src: '/gallery/celestial-moon-neck-tattoo-03.webp',
    alt: 'AI tattoo example 5',
  },
  {
    src: '/gallery/traditional-black-cat-thigh-tattoo-21.webp',
    alt: 'AI tattoo example 6',
  },
  {
    src: '/gallery/polynesian-tribal-shoulder-chest-tattoo-28.webp',
    alt: 'AI tattoo example 7',
  },
  {
    src: '/gallery/lotus-jewelry-thigh-tattoo-12.webp',
    alt: 'AI tattoo example 8',
  },
  {
    src: '/gallery/gothic-blackwork-hand-tattoo-01.webp',
    alt: 'AI tattoo example 9',
  },
  {
    src: '/gallery/ornamental-floral-dagger-back-tattoo-22.webp',
    alt: 'AI tattoo example 10',
  },
  {
    src: '/gallery/butterfly-lotus-neck-back-tattoo-13.webp',
    alt: 'AI tattoo example 11',
  },
  {
    src: '/gallery/biomechanical-gear-arm-tattoo-20.webp',
    alt: 'AI tattoo example 12',
  },
];

const MARQUEE_ROW_2 = [
  {
    src: '/gallery/fine-line-botanical-collarbone-tattoo-36.webp',
    alt: 'AI tattoo example 1',
  },
  {
    src: '/gallery/cyber-sigilism-hand-wrist-tattoo-30.webp',
    alt: 'AI tattoo example 2',
  },
  {
    src: '/gallery/neo-traditional-cat-heart-thigh-tattoo-35.webp',
    alt: 'AI tattoo example 3',
  },
  {
    src: '/gallery/tarot-eye-celestial-forearm-tattoo-38.webp',
    alt: 'AI tattoo example 4',
  },
  {
    src: '/gallery/fine-line-floral-hip-tattoo-39.webp',
    alt: 'AI tattoo example 5',
  },
  {
    src: '/gallery/black-gray-angel-warrior-forearm-tattoo-40.webp',
    alt: 'AI tattoo example 6',
  },
  {
    src: '/gallery/loyalty-script-hand-tattoo-31.webp',
    alt: 'AI tattoo example 7',
  },
  {
    src: '/gallery/anime-manga-portrait-calf-tattoo-37.webp',
    alt: 'AI tattoo example 8',
  },
  {
    src: '/gallery/minimal-black-cat-shoulder-tattoo-42.webp',
    alt: 'AI tattoo example 9',
  },
  {
    src: '/gallery/blackletter-number-hand-finger-tattoo-32.webp',
    alt: 'AI tattoo example 10',
  },
  {
    src: '/gallery/cartoon-character-quote-forearm-tattoo-41.webp',
    alt: 'AI tattoo example 11',
  },
  {
    src: '/gallery/blackwork-scorpion-hand-tattoo-45.webp',
    alt: 'AI tattoo example 12',
  },
];

export function ShowcaseValues(_props: ShowcaseValuesProps) {
  return (
    <>
      {/* SECTION 2: 2-Row Tattoo Example Marquee */}
      <section
        id="gallery"
        className="scroll-mt-20 overflow-hidden pt-10 pb-12 md:pt-12 md:pb-16"
      >
        <div className="relative min-h-[456px] space-y-4 md:min-h-[616px]">
          {/* Left & Right edge fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

          {/* Row 1 */}
          <div className="animate-marquee-left flex w-max gap-3 pr-3 md:gap-4 md:pr-4">
            {[...MARQUEE_ROW_1, ...MARQUEE_ROW_1].map((item, idx) => (
              <div
                key={`r1-${idx}`}
                className="size-[220px] shrink-0 overflow-hidden rounded-xl bg-muted md:size-[300px]"
              >
                <img
                  src={item.src}
                  alt={idx < MARQUEE_ROW_1.length ? item.alt : ''}
                  width={300}
                  height={300}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Row 2 */}
          <div className="animate-marquee-right flex w-max gap-3 pr-3 md:gap-4 md:pr-4">
            {[...MARQUEE_ROW_2, ...MARQUEE_ROW_2].map((item, idx) => (
              <div
                key={`r2-${idx}`}
                className="size-[220px] shrink-0 overflow-hidden rounded-xl bg-muted md:size-[300px]"
              >
                <img
                  src={item.src}
                  alt={idx < MARQUEE_ROW_2.length ? item.alt : ''}
                  width={300}
                  height={300}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Value Props — 3-Column Subgrid Matching InkStudio.ai */}
      <section
        id="why-inkstudio"
        aria-labelledby="home-values-title"
        className="scroll-mt-20 py-12 md:py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
            <h2
              id="home-values-title"
              className="font-display text-3xl font-bold tracking-tight text-balance md:text-4xl"
            >
              {m['home.values.title']()}
            </h2>
          </div>

          <div className="grid gap-x-4 gap-y-12 md:grid-cols-3 md:gap-y-0 lg:gap-x-5">
            {/* Column 1: Your tattoo, your way */}
            <article className="flex min-w-0 flex-col md:row-span-4 md:grid md:grid-rows-subgrid">
              <h3 className="font-display mb-3 text-xl font-semibold tracking-tight text-balance md:leading-7 lg:text-2xl lg:leading-8">
                {m['home.values.c1_title']()}
              </h3>
              <p className="mb-4 text-sm leading-7 text-muted-foreground lg:text-base">
                {m['home.values.c1_desc']()}
              </p>
              <ul className="mb-6 flex flex-wrap content-start items-start gap-2">
                {[
                  m['home.values.c1_t1'](),
                  m['home.values.c1_t2'](),
                  m['home.values.c1_t3'](),
                ].map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md bg-muted/60 px-2.5 py-1 text-xs leading-5 font-medium text-foreground"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <div
                className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f7f6f4]"
                role="img"
                aria-label="Illustrative style selected with a pink shoulder and back placement area, beside a phoenix tattoo preview with pink flowers."
              >
                <div
                  className="grid size-full grid-cols-[35fr_65fr] gap-2 p-3"
                  aria-hidden="true"
                >
                  <div className="grid min-h-0 grid-rows-[45fr_55fr] gap-2">
                    <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-black/10 bg-white p-1 shadow-sm">
                      <span className="px-1.5 py-1 text-left text-[10px] leading-3 font-semibold text-black">
                        {m['home.values.c1_style']()}
                      </span>
                      <div className="min-h-0 flex-1">
                        <img
                          src="/home-values/illustrative-options.webp"
                          alt=""
                          width={345}
                          height={225}
                          loading="lazy"
                          decoding="async"
                          className="size-full object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-black/10 bg-white p-1 shadow-sm">
                      <span className="px-1.5 py-1 text-left text-[10px] leading-3 font-semibold text-black">
                        {m['home.values.c1_placement']()}
                      </span>
                      <div className="min-h-0 flex-1">
                        <img
                          src="/home-values/back-placement-selection.webp"
                          alt=""
                          width={309}
                          height={383}
                          loading="lazy"
                          decoding="async"
                          className="size-full rounded object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="min-h-0 overflow-hidden rounded-lg bg-[#f0e9e2]">
                    <img
                      src="/home-values/phoenix-body-original.webp"
                      alt=""
                      width={987}
                      height={1594}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover object-bottom"
                    />
                  </div>
                </div>
              </div>
            </article>

            {/* Column 2: Powerful AI. Tuned for tattoos. */}
            <article className="flex min-w-0 flex-col md:row-span-4 md:grid md:grid-rows-subgrid">
              <h3 className="font-display mb-3 text-xl font-semibold tracking-tight text-balance md:leading-7 lg:text-2xl lg:leading-8">
                {m['home.values.c2_title']()}
              </h3>
              <p className="mb-4 text-sm leading-7 text-muted-foreground lg:text-base">
                {m['home.values.c2_desc']()}
              </p>
              <ul className="mb-6 flex flex-wrap content-start items-start gap-2">
                {[
                  m['home.values.c2_t1'](),
                  m['home.values.c2_t2'](),
                  m['home.values.c2_t3'](),
                ].map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md bg-muted/60 px-2.5 py-1 text-xs leading-5 font-medium text-foreground"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <div
                className="@container relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f7f6f4] p-3"
                role="img"
                aria-label="Diagram of an image model combined with tattoo-specific prompts and agent optimization to create a tattoo design."
              >
                <div className="relative size-full" aria-hidden="true">
                  <svg
                    className="absolute top-[54%] left-1/4 h-[7%] w-1/2 overflow-visible text-[#ed69ae]"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M0 100V65Q0 40 8 40H92Q100 40 100 65V100M50 40V0"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  <div className="relative grid size-full grid-rows-[58fr_42fr] gap-[6%]">
                    <div className="mx-auto flex min-h-0 w-[82%] flex-col items-center justify-center gap-[1cqw] rounded-lg border border-black/10 bg-white px-2 py-1 text-center shadow-sm">
                      <div className="relative mt-[1cqw] max-h-[18cqw] min-h-0 w-[40cqw] flex-1">
                        <div className="absolute top-[8%] left-[8%] h-[90%] w-[40%] -rotate-12 overflow-hidden rounded border border-black/15 bg-white p-0.5 shadow-sm">
                          <img
                            src="/home-values/fine-line-style.webp"
                            alt=""
                            width={160}
                            height={180}
                            loading="lazy"
                            decoding="async"
                            className="size-full scale-150 object-contain"
                          />
                        </div>
                        <div className="absolute top-[8%] right-[8%] h-[90%] w-[40%] rotate-12 overflow-hidden rounded border border-black/15 bg-white p-0.5 shadow-sm">
                          <img
                            src="/tattoo-how-it-works/clean-artwork.webp"
                            alt=""
                            width={160}
                            height={180}
                            loading="lazy"
                            decoding="async"
                            className="size-full scale-110 object-contain"
                          />
                        </div>
                        <div className="absolute top-0 left-[30%] h-[90%] w-[40%] overflow-hidden rounded border border-black/15 bg-white p-0.5 shadow-sm">
                          <img
                            src="/home-values/phoenix-clean-artwork.webp"
                            alt=""
                            width={160}
                            height={180}
                            loading="lazy"
                            decoding="async"
                            className="size-full object-contain"
                          />
                        </div>
                      </div>
                      <span className="shrink-0 text-[clamp(11px,4.7cqw,26px)] leading-[1.1] font-semibold tracking-tight text-black">
                        {m['home.values.c2_models']()}
                      </span>
                      <span className="mb-[1cqw] shrink-0 text-[clamp(8px,2.8cqw,15px)] leading-tight text-black/60">
                        {m['home.values.c2_optimized']()}
                      </span>
                    </div>

                    <div className="grid min-h-0 grid-cols-2 gap-2">
                      <div className="flex min-h-0 min-w-0 flex-col items-center justify-center gap-[1.5cqw] rounded-lg border border-black/10 bg-white px-2 py-2 text-center shadow-sm">
                        <svg
                          className="h-[10cqw] w-[15cqw] shrink-0"
                          viewBox="0 0 60 40"
                          fill="none"
                          aria-hidden="true"
                        >
                          <rect
                            x="2"
                            y="2"
                            width="56"
                            height="36"
                            rx="5"
                            stroke="#242424"
                            strokeWidth="1.5"
                          />
                          <rect
                            x="9"
                            y="8"
                            width="23"
                            height="7"
                            rx="2"
                            fill="#f8cee3"
                          />
                          <path
                            d="M12 11.5H28M36 11.5H49M10 21H35M40 21H50M10 29H23"
                            stroke="#242424"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M28 29H43"
                            stroke="#ed69ae"
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className="text-[clamp(10px,3.3cqw,18px)] leading-tight font-semibold text-black">
                          {m['home.values.c2_prompts']()}
                        </span>
                      </div>
                      <div className="flex min-h-0 min-w-0 flex-col items-center justify-center gap-[1.5cqw] rounded-lg border border-black/10 bg-white px-2 py-2 text-center shadow-sm">
                        <svg
                          className="h-[10cqw] w-[15cqw] shrink-0"
                          viewBox="0 0 60 40"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M8 11H52M8 29H52"
                            stroke="#242424"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M19 16V20H41V24"
                            stroke="#ed69ae"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <rect
                            x="14"
                            y="5"
                            width="10"
                            height="12"
                            rx="3"
                            fill="white"
                            stroke="#242424"
                            strokeWidth="1.5"
                          />
                          <rect
                            x="36"
                            y="23"
                            width="10"
                            height="12"
                            rx="3"
                            fill="#f8cee3"
                            stroke="#242424"
                            strokeWidth="1.5"
                          />
                        </svg>
                        <span className="text-[clamp(10px,3.3cqw,18px)] leading-tight font-semibold text-black">
                          {m['home.values.c2_agent']()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Column 3: Connect better. Ink confidently. */}
            <article className="flex min-w-0 flex-col md:row-span-4 md:grid md:grid-rows-subgrid">
              <h3 className="font-display mb-3 text-xl font-semibold tracking-tight text-balance md:leading-7 lg:text-2xl lg:leading-8">
                {m['home.values.c3_title']()}
              </h3>
              <p className="mb-4 text-sm leading-7 text-muted-foreground lg:text-base">
                {m['home.values.c3_desc']()}
              </p>
              <ul className="mb-6 flex flex-wrap content-start items-start gap-2">
                {[
                  m['home.values.c3_t1'](),
                  m['home.values.c3_t2'](),
                  m['home.values.c3_t3'](),
                ].map((tag) => (
                  <li
                    key={tag}
                    className="rounded-md bg-muted/60 px-2.5 py-1 text-xs leading-5 font-medium text-foreground"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
              <div
                className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f7f6f4]"
                role="img"
                aria-label="Illustrative consultation: a client and tattoo artist discuss a phoenix design, with body preview and clean artwork reference cards."
              >
                <div
                  className="grid size-full grid-cols-[65fr_35fr] gap-2 p-3"
                  aria-hidden="true"
                >
                  <div className="min-h-0 overflow-hidden rounded-lg bg-[#f0e9e2]">
                    <img
                      src="/home-values/phoenix-consultation-standalone.webp"
                      alt=""
                      width={1173}
                      height={1341}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="grid min-h-0 grid-rows-[45fr_55fr] gap-2">
                    <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-black/10 bg-white p-1 shadow-sm">
                      <span className="px-1.5 py-1 text-left text-[10px] leading-3 font-semibold text-black">
                        {m['home.auth.body_preview']()}
                      </span>
                      <div className="min-h-0 flex-1">
                        <img
                          src="/home-values/phoenix-body-preview.webp"
                          alt=""
                          width={433}
                          height={447}
                          loading="lazy"
                          decoding="async"
                          className="size-full rounded object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex min-h-0 flex-col overflow-hidden rounded-lg border border-black/10 bg-white p-1 shadow-sm">
                      <span className="px-1.5 py-1 text-left text-[10px] leading-3 font-semibold text-black">
                        {m['home.auth.clean_artwork']()}
                      </span>
                      <div className="min-h-0 flex-1">
                        <img
                          src="/home-values/phoenix-clean-artwork.webp"
                          alt=""
                          width={1122}
                          height={1402}
                          loading="lazy"
                          decoding="async"
                          className="size-full object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
