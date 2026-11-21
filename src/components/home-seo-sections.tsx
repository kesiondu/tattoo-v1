import { m } from '@/paraglide/messages.js';
import { InlineLinks } from '@/components/inline-links';

export function StyleOverview() {
  return (
    <section
      id="tattoo-styles"
      className="border-border scroll-mt-20 border-t py-12 md:py-16"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="text-muted-foreground mb-3 text-center text-sm font-medium">
          {m['home.styles.eyebrow']()}
        </p>
        <h2 className="font-display text-center text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          {m['home.styles.title']()}
        </h2>
        <div className="text-muted-foreground mt-5 space-y-4 text-sm leading-7 sm:text-base">
          {m['home.styles.body']()
            .split('\n\n')
            .map((paragraph, index) => (
              <p key={index}>
                <InlineLinks text={paragraph} linkClassName="text-foreground" />
              </p>
            ))}
        </div>
      </div>
    </section>
  );
}

export function SizePlacementTable() {
  const rows: [string, string, string, string][] = [
    [
      m['home.sizes.r1_placement'](),
      m['home.sizes.r1_size'](),
      m['home.sizes.r1_detail'](),
      m['home.sizes.r1_range'](),
    ],
    [
      m['home.sizes.r2_placement'](),
      m['home.sizes.r2_size'](),
      m['home.sizes.r2_detail'](),
      m['home.sizes.r2_range'](),
    ],
    [
      m['home.sizes.r3_placement'](),
      m['home.sizes.r3_size'](),
      m['home.sizes.r3_detail'](),
      m['home.sizes.r3_range'](),
    ],
    [
      m['home.sizes.r4_placement'](),
      m['home.sizes.r4_size'](),
      m['home.sizes.r4_detail'](),
      m['home.sizes.r4_range'](),
    ],
    [
      m['home.sizes.r5_placement'](),
      m['home.sizes.r5_size'](),
      m['home.sizes.r5_detail'](),
      m['home.sizes.r5_range'](),
    ],
    [
      m['home.sizes.r6_placement'](),
      m['home.sizes.r6_size'](),
      m['home.sizes.r6_detail'](),
      m['home.sizes.r6_range'](),
    ],
  ];

  return (
    <section
      id="tattoo-size-placement"
      className="border-border scroll-mt-20 border-t py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-muted-foreground mb-3 text-center text-sm font-medium">
          {m['home.sizes.eyebrow']()}
        </p>
        <h2 className="font-display text-center text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          {m['home.sizes.title']()}
        </h2>
        <div className="text-muted-foreground mx-auto mt-4 max-w-3xl space-y-4 text-sm leading-7">
          {m['home.sizes.intro']()
            .split('\n\n')
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
        </div>

        <div className="border-border mt-8 overflow-x-auto rounded-xl border bg-white">
          <table className="w-full min-w-[760px] border-collapse text-left text-sm">
            <thead className="bg-muted/50 text-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">
                  {m['home.sizes.col_placement']()}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {m['home.sizes.col_size']()}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {m['home.sizes.col_detail']()}
                </th>
                <th className="px-4 py-3 font-semibold">
                  {m['home.sizes.col_range']()}
                </th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td
                      key={cell}
                      className="text-muted-foreground first:text-foreground px-4 py-3 leading-6 first:font-medium"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-muted-foreground mt-4 text-sm leading-7">
          <InlineLinks
            text={m['home.sizes.guide']()}
            linkClassName="text-foreground"
          />
        </p>
      </div>
    </section>
  );
}

export function ArtistBoundary() {
  return (
    <section
      id="ai-artist-guide"
      className="border-border scroll-mt-20 border-t py-12 md:py-16"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-muted-foreground mb-3 text-center text-sm font-medium">
          {m['home.artist.eyebrow']()}
        </p>
        <h2 className="font-display text-center text-2xl font-bold tracking-tight text-balance sm:text-3xl">
          {m['home.artist.title']()}
        </h2>
        <div className="text-muted-foreground mt-5 space-y-4 text-sm leading-7 sm:text-base">
          {m['home.artist.body']()
            .split('\n\n')
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
        </div>
      </div>
    </section>
  );
}
