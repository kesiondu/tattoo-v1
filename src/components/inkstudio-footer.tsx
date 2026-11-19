import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';

export function InkStudioFooter() {
  return (
    <footer className="border-t border-border bg-white pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* Brand Column (spans 2 on desktop) */}
          <div className="col-span-2 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <img
                src="/brand/inkstudioai-logo-primary.svg"
                alt={m['home.brand_logo_alt']()}
                className="size-7 rounded"
              />
              <span className="font-sans text-[18px] font-bold tracking-[-0.02em] text-foreground">
                {m['home.brand']()}
              </span>
            </Link>
            <p className="max-w-[260px] text-sm leading-relaxed text-muted-foreground">
              {m['home.footer.tagline']()}
            </p>
          </div>

          {/* Column 1: Create */}
          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-wider text-foreground uppercase">
              {m['home.footer.create']()}
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  {m['home.footer.generator']()}
                </Link>
              </li>
              <li>
                <Link
                  href="/tattoo-try-on"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  {m['home.footer.try_on']()}
                </Link>
              </li>
              <li>
                <Link
                  href="/tattoo-font-generator"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  {m['home.footer.font_generator']()}
                </Link>
              </li>
              <li>
                <Link
                  href="/my-designs"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  {m['home.footer.my_designs']()}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Explore */}
          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-wider text-foreground uppercase">
              {m['home.footer.explore']()}
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/tattoo-styles"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  {m['home.footer.tattoo_styles']()}
                </Link>
              </li>
              <li>
                <Link
                  href="/tattoo-fonts"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  {m['home.footer.tattoo_fonts']()}
                </Link>
              </li>
              <li>
                <Link
                  href="/tattoo-ideas"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  {m['home.footer.tattoo_ideas']()}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  {m['home.footer.pricing']()}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-wider text-foreground uppercase">
              {m['home.footer.resources']()}
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/tattoo-price-calculator"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  {m['home.footer.price_calculator']()}
                </Link>
              </li>
              <li>
                <Link
                  href="/#faq"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  {m['home.footer.faq']()}
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@inkstudio.ai"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  {m['home.footer.contact']()}
                </a>
              </li>
              <li>
                <Link
                  href="/ai-model-disclosure"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  {m['home.footer.ai_disclosure']()}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="mb-3 text-xs font-semibold tracking-wider text-foreground uppercase">
              {m['home.footer.legal']()}
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/acceptable-use"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  {m['home.footer.acceptable_use']()}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  {m['home.footer.privacy']()}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  {m['home.footer.terms']()}
                </Link>
              </li>
              <li>
                <Link
                  href="/cookie"
                  className="transition-colors hover:text-foreground hover:underline"
                >
                  {m['home.footer.cookie']()}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-10 border-t border-border pt-6 text-[13px] text-muted-foreground">
          {m['home.footer.copyright']()}
        </div>
      </div>
    </footer>
  );
}
