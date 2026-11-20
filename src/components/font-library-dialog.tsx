import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';

import {
  TATTOO_FONT_PRESETS,
  presetStyle,
  type TattooFontPreset,
} from '@/lib/tattoo-font-library';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FontLibraryDialogLabels {
  title: string;
  searchPlaceholder: string;
  all: string;
  script: string;
  gothic: string;
  display: string;
  serif: string;
  handwritten: string;
  showing: (count: number) => string;
  loadMore: (count: number) => string;
  empty: string;
  close: string;
}

interface FontLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (preset: TattooFontPreset) => void;
  selectedId: string | null;
  labels: FontLibraryDialogLabels;
  /** Short word used for every specimen */
  specimen?: string;
}

const PAGE_SIZE = 60;

export function FontLibraryDialog({
  open,
  onOpenChange,
  onSelect,
  selectedId,
  labels,
  specimen = 'Stay',
}: FontLibraryDialogProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [limit, setLimit] = useState(PAGE_SIZE);

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: labels.all },
    { key: 'script', label: labels.script },
    { key: 'gothic', label: labels.gothic },
    { key: 'display', label: labels.display },
    { key: 'serif', label: labels.serif },
    { key: 'handwritten', label: labels.handwritten },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TATTOO_FONT_PRESETS.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, category]);

  const visible = filtered.slice(0, limit);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[86vh] w-[min(920px,94vw)] flex-col gap-0 bg-white p-0 text-foreground">
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle className="font-sans text-base font-semibold">
            {labels.title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3 border-b border-border px-5 py-3">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setLimit(PAGE_SIZE); }}
              placeholder={labels.searchPlaceholder}
              className="h-10 w-full rounded-lg border border-border bg-white pr-9 pl-9 text-sm outline-none focus:border-foreground"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label={labels.close}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => { setCategory(c.key); setLimit(PAGE_SIZE); }}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                  category === c.key
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border text-muted-foreground hover:text-foreground'
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            {labels.showing(filtered.length)}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {visible.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              {labels.empty}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {visible.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => { onSelect(p); onOpenChange(false); }}
                    className={cn(
                      'group flex flex-col overflow-hidden rounded-lg border bg-white transition-all',
                      selectedId === p.id
                        ? 'border-foreground ring-1 ring-foreground'
                        : 'border-border hover:border-foreground/40'
                    )}
                  >
                    <span className="flex h-16 items-center justify-center overflow-hidden px-1.5">
                      <span
                        className="block max-w-full truncate text-center text-[20px] leading-none"
                        style={presetStyle(p)}
                      >
                        {specimen}
                      </span>
                    </span>
                    <span
                      className={cn(
                        'block truncate border-t px-2 py-1.5 text-center text-[10px] font-medium',
                        selectedId === p.id
                          ? 'border-foreground bg-foreground text-background'
                          : 'border-border text-muted-foreground group-hover:text-foreground'
                      )}
                    >
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>

              {limit < filtered.length && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setLimit((n) => n + PAGE_SIZE)}
                    className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
                  >
                    {labels.loadMore(Math.min(PAGE_SIZE, filtered.length - limit))}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
