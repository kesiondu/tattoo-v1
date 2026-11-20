import { useState, type ReactNode } from 'react';

import { AuthModal } from '@/components/auth-modal';
import { MarketingFooter } from '@/components/marketing-footer';
import { MarketingHeader } from '@/components/marketing-header';

interface MarketingPageLayoutProps {
  children: ReactNode | ((props: { openAuth: () => void }) => ReactNode);
}

export function MarketingPageLayout({ children }: MarketingPageLayoutProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const openAuth = () => setAuthModalOpen(true);

  return (
    <div className="text-foreground selection:bg-foreground/15 selection:text-foreground flex min-h-screen flex-col bg-white font-sans">
      <MarketingHeader onOpenAuth={openAuth} />
      <main className="flex-1">
        {typeof children === 'function' ? children({ openAuth }) : children}
      </main>
      <MarketingFooter />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
