import { useState, type ReactNode } from 'react';

import { AuthModal } from '@/components/auth-modal';
import { InkStudioFooter } from '@/components/inkstudio-footer';
import { InkStudioHeader } from '@/components/inkstudio-header';

interface InkStudioPageLayoutProps {
  children: ReactNode | ((props: { openAuth: () => void }) => ReactNode);
}

export function InkStudioPageLayout({ children }: InkStudioPageLayoutProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const openAuth = () => setAuthModalOpen(true);

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-foreground selection:bg-foreground/15 selection:text-foreground">
      <InkStudioHeader onOpenAuth={openAuth} />
      <main className="flex-1">
        {typeof children === 'function' ? children({ openAuth }) : children}
      </main>
      <InkStudioFooter />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
}
