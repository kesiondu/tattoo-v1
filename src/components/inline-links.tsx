import { Link } from '@/core/i18n/navigation';
import { cn } from '@/lib/utils';

const LINK_PATTERN = /(\[[^\]]+\]\([^)]+\))/g;

export function InlineLinks({
  text,
  className,
  linkClassName,
}: {
  text: string;
  className?: string;
  linkClassName?: string;
}) {
  return (
    <span className={className}>
      {text.split(LINK_PATTERN).map((part, index) => {
        const match = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        if (!match) return part;
        const [, label, href] = match;
        const classes = cn(
          'underline decoration-current/30 underline-offset-2 hover:decoration-current',
          linkClassName
        );
        if (href.startsWith('#')) {
          return (
            <a key={`${href}-${index}`} href={href} className={classes}>
              {label}
            </a>
          );
        }
        return (
          <Link key={`${href}-${index}`} href={href} className={classes}>
            {label}
          </Link>
        );
      })}
    </span>
  );
}
