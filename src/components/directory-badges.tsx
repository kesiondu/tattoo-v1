const directories = [
  {
    name: 'Twelve Tools',
    href: 'https://twelve.tools',
    src: '/badges/twelve-tools-light.svg',
  },
  {
    name: 'Neeed Directory',
    href: 'https://neeed.directory/products/tattoo-generator?utm_source=tattoo-generator',
    src: 'https://neeed.directory/badges/neeed-badge-light.svg',
  },
  {
    name: 'Findly.tools',
    href: 'https://findly.tools',
    src: 'https://findly.tools/badges/findly-tools-badge-light.svg',
  },
  {
    name: 'Startup Fame',
    href: 'https://startupfa.me',
    src: '/badges/startup-fame.webp',
  },
  {
    name: 'ToolRain',
    href: 'https://toolrain.com',
    src: '/badges/toolrain.png',
  },
  { name: 'Fazier', href: 'https://fazier.com', src: '/badges/fazier.svg' },
  {
    name: 'DodoDirectory',
    href: 'https://dododirectory.com',
    src: '/badges/dodo.png',
  },
  { name: 'ufind.best', href: 'https://ufind.best', src: '/badges/ufind.svg' },
  {
    name: 'DanielLaunches',
    href: 'https://daniellaunches.com',
    src: '/badges/daniel-launches.svg',
  },
  { name: 'Lifto', href: 'https://liftoapp.com', src: '/badges/lifto.svg' },
  {
    name: 'LaunchBuff',
    href: 'https://launchbuff.com',
    src: '/badges/launchbuff.png',
  },
  {
    name: 'IndieHunt',
    href: 'https://indiehunt.io',
    src: '/badges/indiehunt.png',
  },
  {
    name: 'ToolPilot.ai',
    href: 'https://www.toolpilot.ai',
    src: '/badges/toolpilot.png',
  },
  {
    name: 'Launch Llama',
    href: 'https://tools.launchllama.co',
    src: '/badges/launch-llama.webp',
  },
];

/**
 * Reciprocal badges for the directories that require a visible listing badge.
 * Kept in the footer so they are available on every page, including the homepage.
 */
export function DirectoryBadges() {
  return (
    <section aria-label="Featured on" className="mt-8">
      <p className="mb-4 text-[10px] font-semibold tracking-[0.18em] text-neutral-500 uppercase">
        Featured on
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
        {directories.map((directory) => (
          <a
            key={directory.name}
            href={directory.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Featured on ${directory.name}`}
            className="opacity-75 transition-opacity hover:opacity-100"
          >
            <img
              src={directory.src}
              alt={`Featured on ${directory.name}`}
              loading="lazy"
              decoding="async"
              className="h-8 w-auto max-w-[132px] object-contain"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
