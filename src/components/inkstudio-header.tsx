'use client';

import { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useSession } from '@/core/auth/client';
import { Link } from '@/core/i18n/navigation';
import { LocaleSelector } from '@/components/locale-selector';
import { SiteUserMenu } from '@/components/site-user-menu';
import { AuthModal } from '@/components/auth-modal';

interface InkStudioHeaderProps {
  onOpenAuth?: () => void;
}

export function InkStudioHeader({ onOpenAuth }: InkStudioHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [stylesDropdown, setStylesDropdown] = useState(false);
  const [toolsDropdown, setToolsDropdown] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  function handleAuthClick() {
    if (onOpenAuth) {
      onOpenAuth();
    } else {
      setAuthModalOpen(true);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Left Brand & Navigation */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/brand/inkstudioai-logo-primary.svg"
                alt="InkStudio.ai"
                className="size-7 rounded"
              />
              <span className="font-sans text-base font-semibold tracking-tight text-foreground">
                InkStudio.ai
              </span>
            </Link>

            {/* Desktop Nav Items */}
            <nav className="hidden items-center gap-1 md:flex">
              <Link
                href="/"
                className="inline-flex h-8 items-center justify-center rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
              >
                AI Generator
              </Link>

              {/* Styles Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setStylesDropdown(!stylesDropdown);
                    setToolsDropdown(false);
                  }}
                  className="inline-flex h-8 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                >
                  <span>Styles</span>
                  <ChevronDown className="size-3.5 opacity-60" />
                </button>

                {stylesDropdown && (
                  <div
                    className="absolute left-0 top-full mt-1.5 w-48 rounded-xl border border-border bg-card p-1.5 shadow-lg z-50 text-xs"
                    onMouseLeave={() => setStylesDropdown(false)}
                  >
                    {[
                      { name: 'Fine Line', href: '/tattoo-ideas?style=fine-line' },
                      { name: 'Minimalist', href: '/tattoo-ideas?style=minimalist' },
                      { name: 'Realism', href: '/tattoo-ideas?style=realism' },
                      { name: 'Japanese', href: '/tattoo-ideas?style=japanese' },
                      { name: 'Neo Traditional', href: '/tattoo-ideas?style=neo-traditional' },
                      { name: 'Geometric', href: '/tattoo-ideas?style=geometric' },
                      { name: 'Watercolor', href: '/tattoo-ideas?style=watercolor' },
                    ].map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setStylesDropdown(false)}
                        className="block rounded-lg px-2.5 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Tools Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setToolsDropdown(!toolsDropdown);
                    setStylesDropdown(false);
                  }}
                  className="inline-flex h-8 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                >
                  <span>Tools</span>
                  <ChevronDown className="size-3.5 opacity-60" />
                </button>

                {toolsDropdown && (
                  <div
                    className="absolute left-0 top-full mt-1.5 w-52 rounded-xl border border-border bg-card p-1.5 shadow-lg z-50 text-xs"
                    onMouseLeave={() => setToolsDropdown(false)}
                  >
                    <Link
                      href="/tattoo-font-generator"
                      onClick={() => setToolsDropdown(false)}
                      className="block rounded-lg px-2.5 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      Font Generator
                    </Link>
                    <Link
                      href="/tattoo-try-on"
                      onClick={() => setToolsDropdown(false)}
                      className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <span>Try On 3D</span>
                      <span className="rounded bg-primary/10 px-1 py-0.2 text-[9px] font-semibold text-primary">3D</span>
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/tattoo-ideas"
                className="inline-flex h-8 items-center justify-center rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Tattoo Ideas
              </Link>
              <Link
                href="/pricing"
                className="inline-flex h-8 items-center justify-center rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Pricing
              </Link>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <LocaleSelector variant="icon" className="size-8 rounded-full border border-border hover:bg-muted" />

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/pricing"
                  className="hidden sm:inline-flex h-7 items-center justify-center rounded-lg bg-primary px-2.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-all"
                >
                  Buy credits
                </Link>
                <SiteUserMenu
                  name={user.name || 'User'}
                  email={user.email}
                  image={user.image}
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAuthClick}
                  className="inline-flex h-7 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={handleAuthClick}
                  className="inline-flex h-7 items-center justify-center rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Try for free
                </button>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground md:hidden"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background px-4 py-3 md:hidden space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              AI Generator
            </Link>
            <Link
              href="/tattoo-font-generator"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Font Generator
            </Link>
            <Link
              href="/tattoo-try-on"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Try On 3D
            </Link>
            <Link
              href="/tattoo-ideas"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Tattoo Ideas
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Pricing
            </Link>
          </div>
        )}
      </header>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
}
