import { useState, type ReactNode } from 'react';

import { AuthModal } from '@/components/auth-modal';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

interface SitePageLayoutProps {
  children: ReactNode | ((props: { openAuth: () => void }) => ReactNode);
}

export function SitePageLayout({ children }: SitePageLayoutProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const openAuth = () => setAuthModalOpen(true);

  return (
    <div className="text-foreground selection:bg-foreground/15 selection:text-foreground flex min-h-screen flex-col bg-white font-sans">
      <SiteHeader onOpenAuth={openAuth} />
      <main className="flex-1">
        {typeof children === 'function' ? children({ openAuth }) : children}
      </main>
      <SiteFooter />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
