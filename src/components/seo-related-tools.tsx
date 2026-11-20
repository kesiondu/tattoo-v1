import { ArrowRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';

interface SeoRelatedToolsProps {
  className?: string;
  items: { href: string; label: string }[];
}

export function SeoRelatedTools({ className, items }: SeoRelatedToolsProps) {
  return (
    <nav
      aria-label={m['common.seo.related_tools']()}
      className={`border-border mx-auto max-w-7xl border-t px-4 py-10 sm:px-6 lg:px-8 ${className ?? ''}`}
    >
      <h2 className="text-foreground text-lg font-semibold tracking-tight">
        {m['common.seo.related_tools']()}
      </h2>
      <ul className="mt-4 flex flex-wrap gap-3">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="border-border text-foreground hover:bg-muted inline-flex min-h-10 items-center gap-2 rounded-lg border bg-white px-3.5 py-2 text-sm font-medium transition-colors"
            >
              {item.label}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
