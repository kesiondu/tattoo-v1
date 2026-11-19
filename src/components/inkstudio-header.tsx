import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calculator, ChevronDown, Menu, Sparkles, X } from 'lucide-react';

import { useSession } from '@/core/auth/client';
import { Link, usePathname } from '@/core/i18n/navigation';
import { apiGet } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { AuthModal } from '@/components/auth-modal';
import { LocaleSelector } from '@/components/locale-selector';
import { SiteUserMenu } from '@/components/site-user-menu';

interface InkStudioHeaderProps {
  onOpenAuth?: () => void;
}

export function InkStudioHeader({ onOpenAuth }: InkStudioHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalAuthOpen, setInternalAuthOpen] = useState(false);
  const [stylesOpen, setStylesOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;

  const creditsQuery = useQuery({
    queryKey: ['user-credits-balance'],
    queryFn: () => apiGet<{ balance: number }>('/api/credits'),
    enabled: !!user,
    staleTime: 60_000,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function handleAuthClick() {
    if (onOpenAuth) {
      onOpenAuth();
    } else {
      setInternalAuthOpen(true);
    }
  }

  const styleItems = [
    { label: m['home.style.fine_line'](), href: '/tattoo-ideas?style=fine-line' },
    { label: m['home.style.minimalist'](), href: '/tattoo-ideas?style=minimalist' },
    { label: m['home.style.lettering'](), href: '/tattoo-ideas?style=lettering' },
    { label: m['home.style.realism'](), href: '/tattoo-ideas?style=realism' },
    { label: m['home.style.black_grey'](), href: '/tattoo-ideas?style=black-grey' },
    {
      label: m['home.style.american_traditional'](),
      href: '/tattoo-ideas?style=american-traditional',
    },
    { label: m['home.style.japanese'](), href: '/tattoo-ideas?style=japanese' },
    { label: m['home.style.blackwork'](), href: '/tattoo-ideas?style=blackwork' },
    { label: m['home.style.geometric'](), href: '/tattoo-ideas?style=geometric' },
    {
      label: m['home.style.neo_traditional'](),
      href: '/tattoo-ideas?style=neo-traditional',
    },
  ];

  const navLinkCls =
    'inline-flex h-9 items-center justify-center rounded-lg px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted';

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-200',
          scrolled
            ? 'border-b border-black/5 bg-white/90 backdrop-blur-xl'
            : 'border-b border-transparent bg-white/80 backdrop-blur-md'
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Brand Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <img
              src="/brand/inkstudioai-logo-primary.svg"
              alt={m['home.brand_logo_alt']()}
              className="size-7 rounded"
            />
            <span className="font-sans text-[18px] font-bold tracking-[-0.02em] text-foreground">
              {m['home.brand']()}
            </span>
          </Link>

          {/* Center: Desktop 7-item Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="/"
              className={cn(navLinkCls, pathname === '/' && 'bg-muted')}
            >
              {m['home.nav.ai_generator']()}
            </Link>

            <Link
              href="/tattoo-font-generator"
              className={cn(
                navLinkCls,
                pathname === '/tattoo-font-generator' && 'bg-muted'
              )}
            >
              {m['home.nav.font_generator']()}
            </Link>

            <Link
              href="/tattoo-try-on"
              className={cn(
                navLinkCls,
                'gap-1',
                pathname === '/tattoo-try-on' && 'bg-muted'
              )}
            >
              <span>{m['home.nav.try_on']()}</span>
              <span className="-mt-2 rounded bg-muted px-1 py-0.5 text-[9px] leading-none font-semibold text-muted-foreground">
                {m['home.nav.badge_3d']()}
              </span>
            </Link>

            {/* Styles dropdown */}
            <div
              className="relative"
              onMouseLeave={() => setStylesOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setStylesOpen((v) => !v);
                  setToolsOpen(false);
                }}
                onMouseEnter={() => {
                  setStylesOpen(true);
                  setToolsOpen(false);
                }}
                className={cn(
                  navLinkCls,
                  'gap-1',
                  pathname === '/tattoo-styles' && 'bg-muted'
                )}
              >
                <span>{m['home.nav.styles']()}</span>
                <ChevronDown
                  className={cn(
                    'size-3.5 text-muted-foreground transition-transform duration-150',
                    stylesOpen && 'rotate-180'
                  )}
                />
              </button>

              {stylesOpen && (
                <div className="absolute top-full left-0 z-50 w-56 pt-1.5">
                  <div className="rounded-xl border border-border bg-white p-1.5 shadow-lg">
                    <div className="grid grid-cols-1 gap-0.5">
                      {styleItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setStylesOpen(false)}
                          className="block rounded-lg px-3 py-1.5 text-sm text-foreground/85 transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-1 border-t border-border pt-1">
                      <Link
                        href="/tattoo-styles"
                        onClick={() => setStylesOpen(false)}
                        className="block rounded-lg px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        {m['home.nav.view_all_styles']()} →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/tattoo-ideas"
              className={cn(
                navLinkCls,
                pathname === '/tattoo-ideas' && 'bg-muted'
              )}
            >
              {m['home.nav.tattoo_ideas']()}
            </Link>

            {/* Tools dropdown */}
            <div
              className="relative"
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setToolsOpen((v) => !v);
                  setStylesOpen(false);
                }}
                onMouseEnter={() => {
                  setToolsOpen(true);
                  setStylesOpen(false);
                }}
                className={cn(
                  navLinkCls,
                  'gap-1',
                  pathname === '/tattoo-price-calculator' && 'bg-muted'
                )}
              >
                <span>{m['home.nav.tools']()}</span>
                <ChevronDown
                  className={cn(
                    'size-3.5 text-muted-foreground transition-transform duration-150',
                    toolsOpen && 'rotate-180'
                  )}
                />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 z-50 w-56 pt-1.5">
                  <div className="rounded-xl border border-border bg-white p-1.5 shadow-lg">
                    <Link
                      href="/tattoo-price-calculator"
                      onClick={() => setToolsOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/85 transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Calculator className="size-4 text-muted-foreground" />
                      <span>{m['home.nav.price_calculator']()}</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/pricing"
              className={cn(
                navLinkCls,
                pathname === '/pricing' && 'bg-muted'
              )}
            >
              {m['home.nav.pricing']()}
            </Link>
          </nav>

          {/* Right: Language + Auth / Credits + Mobile Menu */}
          <div className="flex items-center gap-2">
            <LocaleSelector
              variant="icon"
              className="size-8 rounded-full border border-border bg-white text-foreground hover:bg-muted"
            />

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/settings/credits"
                  className="hidden items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted sm:inline-flex"
                >
                  <Sparkles className="size-3.5" />
                  <span>
                    {m['home.nav.credits']({
                      count: creditsQuery.data?.balance ?? 0,
                    })}
                  </span>
                </Link>
                <SiteUserMenu
                  name={user.name}
                  email={user.email}
                  image={user.image}
                />
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAuthClick}
                className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-white px-3 text-[13px] font-medium text-foreground transition-colors hover:bg-muted"
              >
                {m['home.nav.log_in']()}
              </button>
            )}

            <button
              type="button"
              aria-label={m['home.nav.menu']()}
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="inline-flex size-8 items-center justify-center rounded-md border border-border bg-white text-foreground hover:bg-muted lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="size-4" />
              ) : (
                <Menu className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-white px-4 py-3 shadow-sm lg:hidden">
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg bg-muted px-3 py-2 text-sm font-medium text-foreground"
              >
                {m['home.nav.ai_generator']()}
              </Link>
              <Link
                href="/tattoo-font-generator"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                {m['home.nav.font_generator']()}
              </Link>
              <Link
                href="/tattoo-try-on"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                <span>{m['home.nav.try_on']()}</span>
                <span className="rounded bg-foreground px-1 py-0.5 text-[9px] leading-none font-semibold text-background">
                  {m['home.nav.badge_3d']()}
                </span>
              </Link>
              <Link
                href="/tattoo-styles"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                {m['home.nav.styles']()}
              </Link>
              <Link
                href="/tattoo-ideas"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                {m['home.nav.tattoo_ideas']()}
              </Link>
              <Link
                href="/tattoo-price-calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                {m['home.nav.price_calculator']()}
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                {m['home.nav.pricing']()}
              </Link>
            </nav>
          </div>
        )}
      </header>

      {!onOpenAuth && (
        <AuthModal open={internalAuthOpen} onOpenChange={setInternalAuthOpen} />
      )}
    </>
  );
}
