import { m } from '@/paraglide/messages.js';
import { InlineLinks } from '@/components/inline-links';

const TEXT_TYPES = [
  {
    title: 'pages.fontgen.seo_name_title',
    body: 'pages.fontgen.seo_name_body',
  },
  {
    title: 'pages.fontgen.seo_roman_title',
    body: 'pages.fontgen.seo_roman_body',
  },
  {
    title: 'pages.fontgen.seo_quotes_title',
    body: 'pages.fontgen.seo_quotes_body',
  },
  {
    title: 'pages.fontgen.seo_numbers_title',
    body: 'pages.fontgen.seo_numbers_body',
  },
] as const;

const SIZE_ROWS = [1, 2, 3, 4, 5] as const;

const TEXT_IDEAS = [
  {
    label: 'pages.fontgen.seo_ideas_latin',
    phrases: [
      'Amor Fati',
      'Memento Mori',
      'Carpe Diem',
      'Veni Vidi Vici',
      'Per Aspera Ad Astra',
    ],
  },
  {
    label: 'pages.fontgen.seo_ideas_short',
    phrases: [
      'Fearless',
      'Resilience',
      'Stay True',
      'Still I Rise',
      'Grace & Grit',
    ],
  },
  {
    label: 'pages.fontgen.seo_ideas_dates',
    phrases: ['MMXXVI', 'EST. 1998', '34.0522° N, 118.2437° W', 'XI', 'XXI'],
  },
] as const;

const DEEP_DIVES = [
  {
    title: 'pages.fontgen.seo_gothic_title',
    body: 'pages.fontgen.seo_gothic_body',
  },
  {
    title: 'pages.fontgen.seo_chicano_title',
    body: 'pages.fontgen.seo_chicano_body',
  },
  {
    title: 'pages.fontgen.seo_cursive_title',
    body: 'pages.fontgen.seo_cursive_body',
  },
  {
    title: 'pages.fontgen.seo_typewriter_title',
    body: 'pages.fontgen.seo_typewriter_body',
  },
] as const;

export function FontSeoModules({
  onPickText,
}: {
  onPickText: (text: string) => void;
}) {
  return (
    <>
      {/* Best fonts by text type */}
      <section
        id="font-text-types"
        className="border-border border-t py-12 sm:py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
            {m['pages.fontgen.seo_types_title']()}
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {TEXT_TYPES.map((item) => (
              <article
                key={item.title}
                className="border-border rounded-xl border bg-white p-6"
              >
                <h3 className="text-foreground text-base font-semibold">
                  {m[item.title]()}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-7">
                  <InlineLinks
                    text={m[item.body]()}
                    linkClassName="text-foreground"
                  />
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Font size and placement table */}
      <section
        id="font-size-placement"
        className="border-border bg-muted/20 border-y py-12 sm:py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
            {m['pages.fontgen.seo_sizes_title']()}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-7">
            <InlineLinks
              text={m['pages.fontgen.seo_sizes_intro']()}
              linkClassName="text-foreground"
            />
          </p>

          <div className="border-border mt-6 overflow-x-auto rounded-xl border bg-white">
            <table className="w-full table-fixed border-collapse text-left text-xs sm:text-sm">
              <thead className="bg-muted/50 text-foreground">
                <tr>
                  <th className="w-[29%] px-2 py-3 font-semibold sm:px-4">
                    {m['pages.fontgen.seo_sizes_col_placement']()}
                  </th>
                  <th className="w-[43%] px-2 py-3 font-semibold sm:px-4">
                    {m['pages.fontgen.seo_sizes_col_fonts']()}
                  </th>
                  <th className="w-[28%] px-2 py-3 font-semibold sm:px-4">
                    {m['pages.fontgen.seo_sizes_col_height']()}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {SIZE_ROWS.map((row) => (
                  <tr key={row}>
                    <th className="text-foreground px-2 py-3 text-left font-medium sm:px-4">
                      {m[`pages.fontgen.seo_sizes_r${row}_placement`]()}
                    </th>
                    <td className="text-muted-foreground px-2 py-3 leading-6 sm:px-4">
                      {m[`pages.fontgen.seo_sizes_r${row}_fonts`]()}
                    </td>
                    <td className="text-muted-foreground px-2 py-3 leading-6 sm:px-4">
                      {m[`pages.fontgen.seo_sizes_r${row}_height`]()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Text ideas */}
      <section
        id="font-text-ideas"
        className="border-border border-t py-12 sm:py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
            {m['pages.fontgen.seo_ideas_title']()}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-3xl text-sm leading-7">
            {m['pages.fontgen.seo_ideas_intro']()}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {TEXT_IDEAS.map((group) => (
              <article
                key={group.label}
                className="border-border rounded-xl border bg-white p-5"
              >
                <h3 className="text-foreground text-sm font-semibold">
                  {m[group.label]()}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.phrases.map((phrase) => (
                    <button
                      key={phrase}
                      type="button"
                      onClick={() => onPickText(phrase)}
                      className="border-border text-foreground hover:border-foreground hover:bg-foreground hover:text-background cursor-pointer rounded-full border px-3 py-1.5 text-left text-xs font-medium transition-colors"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Deep dives */}
      <section className="border-border bg-muted/20 border-y py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
            {m['pages.fontgen.seo_deep_title']()}
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {DEEP_DIVES.map((item) => (
              <article
                key={item.title}
                className="border-border rounded-xl border bg-white p-6"
              >
                <h3 className="text-foreground text-base font-semibold">
                  {m[item.title]()}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm leading-7">
                  <InlineLinks
                    text={m[item.body]()}
                    linkClassName="text-foreground"
                  />
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
