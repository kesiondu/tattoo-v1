import { Link } from '@/core/i18n/navigation';

export function InkStudioFooter() {
  return (
    <footer className="border-t border-border bg-background py-12 text-xs text-muted-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 md:gap-10">
          {/* Brand Info */}
          <div className="col-span-2 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/brand/inkstudioai-logo-primary.svg"
                alt="InkStudio.ai"
                className="size-6 rounded"
              />
              <span className="font-sans text-sm font-semibold tracking-tight text-foreground">
                InkStudio.ai
              </span>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed">
              The AI tattoo generator designed for real bodies and real artists. Create, preview in 3D, and export clean artwork for your tattoo consultations.
            </p>
            <div className="text-[11px] text-muted-foreground pt-2">
              © {new Date().getFullYear()} InkStudio.ai. All rights reserved.
            </div>
          </div>

          {/* Links Column 1: Product */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  AI Tattoo Generator
                </Link>
              </li>
              <li>
                <Link href="/tattoo-try-on" className="hover:text-foreground transition-colors">
                  3D Body Try On
                </Link>
              </li>
              <li>
                <Link href="/tattoo-font-generator" className="hover:text-foreground transition-colors">
                  Tattoo Font Generator
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground transition-colors">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2: Styles */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">Popular Styles</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/tattoo-ideas?style=fine-line" className="hover:text-foreground transition-colors">
                  Fine Line
                </Link>
              </li>
              <li>
                <Link href="/tattoo-ideas?style=minimalist" className="hover:text-foreground transition-colors">
                  Minimalist
                </Link>
              </li>
              <li>
                <Link href="/tattoo-ideas?style=japanese" className="hover:text-foreground transition-colors">
                  Japanese Irezumi
                </Link>
              </li>
              <li>
                <Link href="/tattoo-ideas?style=geometric" className="hover:text-foreground transition-colors">
                  Geometric & Mandalas
                </Link>
              </li>
              <li>
                <Link href="/tattoo-ideas?style=micro-realism" className="hover:text-foreground transition-colors">
                  Micro-Realism
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Legal & Resources */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground transition-colors">
                  Tattoo Guides & Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
