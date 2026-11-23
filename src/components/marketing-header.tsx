import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Calculator,
  ChevronDown,
  Menu,
  PenTool,
  Sparkles,
  X,
} from 'lucide-react';

import { useSession } from '@/core/auth/client';
import { Link, usePathname } from '@/core/i18n/navigation';
import { apiGet } from '@/lib/api-client';
import { cn } from '@/lib/utils';
import { m } from '@/paraglide/messages.js';
import { AuthModal } from '@/components/auth-modal';
import { LocaleSelector } from '@/components/locale-selector';
import { SiteUserMenu } from '@/components/site-user-menu';

interface MarketingHeaderProps {
  onOpenAuth?: () => void;
}

export function MarketingHeader({ onOpenAuth }: MarketingHeaderProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalAuthOpen, setInternalAuthOpen] = useState(false);
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
          <Link href="/" className="flex h-10 shrink-0 items-center gap-2">
            <img
              src="/brand/tattoo-generator-logo.svg"
              alt={m['home.brand_logo_alt']()}
              className="size-7 rounded"
            />
            <span className="text-foreground hidden font-sans text-[18px] font-bold tracking-[-0.02em] min-[420px]:inline lg:inline">
              {m['home.brand']()}
            </span>
          </Link>

          {/* Center: Desktop Navigation */}
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
              <span className="bg-muted text-muted-foreground -mt-2 rounded px-1 py-0.5 text-[9px] leading-none font-semibold">
                {m['home.nav.badge_3d']()}
              </span>
            </Link>

            {/* Tools dropdown */}
            <div className="relative" onMouseLeave={() => setToolsOpen(false)}>
              <button
                type="button"
                onClick={() => setToolsOpen((v) => !v)}
                onMouseEnter={() => setToolsOpen(true)}
                className={cn(
                  navLinkCls,
                  'gap-1',
                  pathname === '/tattoo-price-calculator' && 'bg-muted'
                )}
              >
                <span>{m['home.nav.tools']()}</span>
                <ChevronDown
                  className={cn(
                    'text-muted-foreground size-3.5 transition-transform duration-150',
                    toolsOpen && 'rotate-180'
                  )}
                />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 z-50 w-56 pt-1.5">
                  <div className="border-border rounded-xl border bg-white p-1.5 shadow-lg">
                    <Link
                      href="/tattoo-price-calculator"
                      onClick={() => setToolsOpen(false)}
                      className="text-foreground/85 hover:bg-muted hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                    >
                      <Calculator className="text-muted-foreground size-4" />
                      <span>{m['home.nav.price_calculator']()}</span>
                    </Link>
                    <Link
                      href="/tattoo-stencil-generator"
                      onClick={() => setToolsOpen(false)}
                      className="text-foreground/85 hover:bg-muted hover:text-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
                    >
                      <PenTool className="text-muted-foreground size-4" />
                      <span>{m['home.nav.stencil_generator']()}</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/pricing"
              className={cn(navLinkCls, pathname === '/pricing' && 'bg-muted')}
            >
              {m['home.nav.pricing']()}
            </Link>
          </nav>

          {/* Right: Language + Auth / Credits + Mobile Menu */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <LocaleSelector
              variant="icon"
              className="border-border text-foreground hover:bg-muted size-10 rounded-full border bg-white"
            />

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/settings/credits"
                  className="border-border text-foreground hover:bg-muted hidden items-center gap-1.5 rounded-full border bg-white px-3 py-1 text-xs font-medium transition-colors sm:inline-flex"
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
                className="border-border text-foreground hover:bg-muted inline-flex h-10 shrink-0 items-center justify-center rounded-lg border bg-white px-2.5 text-[13px] font-medium whitespace-nowrap transition-colors sm:px-3"
              >
                {m['home.nav.log_in']()}
              </button>
            )}

            <button
              type="button"
              aria-label={m['home.nav.menu']()}
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="border-border text-foreground hover:bg-muted inline-flex size-10 items-center justify-center rounded-md border bg-white lg:hidden"
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
          <div className="border-border border-t bg-white px-4 py-3 shadow-sm lg:hidden">
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-muted text-foreground rounded-lg px-3 py-2 text-sm font-medium"
              >
                {m['home.nav.ai_generator']()}
              </Link>
              <Link
                href="/tattoo-font-generator"
                onClick={() => setMobileMenuOpen(false)}
                className="text-foreground hover:bg-muted rounded-lg px-3 py-2 text-sm font-medium"
              >
                {m['home.nav.font_generator']()}
              </Link>
              <Link
                href="/tattoo-try-on"
                onClick={() => setMobileMenuOpen(false)}
                className="text-foreground hover:bg-muted flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium"
              >
                <span>{m['home.nav.try_on']()}</span>
                <span className="bg-foreground text-background rounded px-1 py-0.5 text-[9px] leading-none font-semibold">
                  {m['home.nav.badge_3d']()}
                </span>
              </Link>
              <Link
                href="/tattoo-price-calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="text-foreground hover:bg-muted rounded-lg px-3 py-2 text-sm font-medium"
              >
                {m['home.nav.price_calculator']()}
              </Link>
              <Link
                href="/tattoo-stencil-generator"
                onClick={() => setMobileMenuOpen(false)}
                className="text-foreground hover:bg-muted rounded-lg px-3 py-2 text-sm font-medium"
              >
                {m['home.nav.stencil_generator']()}
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="text-foreground hover:bg-muted rounded-lg px-3 py-2 text-sm font-medium"
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
