import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { signIn, signUp } from '@/core/auth/client';
import { Link, useRouter } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const DEMO_CAROUSEL = [
  {
    style: 'watercolor',
    bodyImg: '/dialog-examples/watercolor-body.webp',
    paperImg: '/dialog-examples/watercolor-paper.webp',
  },
  {
    style: 'bird',
    bodyImg: '/dialog-examples/bird-body.webp',
    paperImg: '/dialog-examples/bird-paper.webp',
  },
  {
    style: 'fox',
    bodyImg: '/dialog-examples/fox-body.webp',
    paperImg: '/dialog-examples/fox-paper.webp',
  },
];

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: 'signin' | 'signup';
}

export function AuthModal({
  open,
  onOpenChange,
  defaultTab = 'signin',
}: AuthModalProps) {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(defaultTab === 'signup');
  const [slideIndex, setSlideIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentSlide = DEMO_CAROUSEL[slideIndex];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    try {
      if (isSignUp) {
        const res = await signUp.email({
          email,
          password,
          name: name || email.split('@')[0],
        });
        if (res.error) {
          toast.error(res.error.message || m['home.auth.failed']());
        } else {
          toast.success(m['home.auth.signed_up']());
          onOpenChange(false);
          await router.refresh();
        }
      } else {
        const res = await signIn.email({
          email,
          password,
        });
        if (res.error) {
          toast.error(res.error.message || m['home.auth.failed']());
        } else {
          toast.success(m['home.auth.signed_in']());
          onOpenChange(false);
          await router.refresh();
        }
      }
    } catch (err: any) {
      toast.error(err?.message || m['home.auth.failed']());
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: window.location.href,
      });
    } catch (err: any) {
      toast.error(err?.message || m['home.auth.failed']());
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed top-1/2 left-1/2 z-50 grid max-h-[calc(100dvh-1rem)] w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-0 overflow-hidden overflow-y-auto rounded-xl border-0 bg-white p-0 text-sm text-neutral-950 ring-1 ring-black/10 duration-100 outline-none sm:max-w-[460px] md:w-[960px] md:max-w-[calc(100vw-2rem)]">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {isSignUp
              ? m['home.auth.signup_title']()
              : m['home.auth.signin_title']()}
          </DialogTitle>
          <DialogDescription>
            {isSignUp
              ? m['home.auth.signup_desc']()
              : m['home.auth.signin_desc']()}
          </DialogDescription>
        </DialogHeader>

        <div className="grid min-w-0 md:grid-cols-2">
          {/* Left Preview Carousel Panel */}
          <div className="flex min-w-0 flex-col overflow-hidden bg-[#f6f5f2] pt-4 pb-2 md:min-h-[520px] md:justify-center md:py-6">
            <div className="flex w-full min-w-0 shrink-0 flex-col items-center">
              <div className="grid w-full min-w-0 grid-cols-2 items-start gap-2.5 px-3.5 md:gap-3 md:px-[18px]">
                {/* Body Preview */}
                <div className="flex min-w-0 flex-col">
                  <div className="relative isolate h-[clamp(180px,56vw,220px)] w-full overflow-hidden rounded-md bg-[#eeece8] shadow-inner md:aspect-[2/3] md:h-auto">
                    <img
                      src={currentSlide.bodyImg}
                      alt={m['home.auth.body_preview']()}
                      className="absolute inset-0 h-full w-full object-contain object-center transition-all duration-300"
                    />
                    <span className="pointer-events-none absolute bottom-1.5 left-1/2 z-10 w-max max-w-[calc(100%-12px)] -translate-x-1/2 rounded-md bg-white/85 px-2 py-0.5 text-center text-[11px] leading-4 font-medium text-[#3d3934] md:hidden">
                      {m['home.auth.body_preview']()}
                    </span>
                  </div>
                  <span className="hidden min-h-[30px] items-center justify-center px-0.5 py-1.5 text-center text-[11px] leading-4 font-medium text-[#66615b] md:flex md:text-xs">
                    {m['home.auth.body_preview']()}
                  </span>
                </div>

                {/* Clean Artwork */}
                <div className="flex min-w-0 flex-col">
                  <div className="relative isolate h-[clamp(180px,56vw,220px)] w-full overflow-hidden rounded-md bg-white shadow-inner md:aspect-[2/3] md:h-auto">
                    <img
                      src={currentSlide.paperImg}
                      alt={m['home.auth.clean_artwork']()}
                      className="absolute inset-0 h-full w-full object-contain object-center transition-all duration-300"
                    />
                    <span className="pointer-events-none absolute bottom-1.5 left-1/2 z-10 w-max max-w-[calc(100%-12px)] -translate-x-1/2 rounded-md bg-white/85 px-2 py-0.5 text-center text-[11px] leading-4 font-medium text-[#3d3934] md:hidden">
                      {m['home.auth.clean_artwork']()}
                    </span>
                  </div>
                  <span className="hidden min-h-[30px] items-center justify-center px-0.5 py-1.5 text-center text-[11px] leading-4 font-medium text-[#66615b] md:flex md:text-xs">
                    {m['home.auth.clean_artwork']()}
                  </span>
                </div>
              </div>

              {/* Slider Controls */}
              <div className="mt-3 flex h-8 shrink-0 items-center justify-center gap-2.5">
                <button
                  type="button"
                  aria-label={m['home.auth.prev']()}
                  onClick={() =>
                    setSlideIndex(
                      (i) =>
                        (i - 1 + DEMO_CAROUSEL.length) % DEMO_CAROUSEL.length
                    )
                  }
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#716d67] transition-colors hover:bg-[#e8e5df] hover:text-[#171511]"
                >
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m15 18-6-6 6-6"
                    />
                  </svg>
                </button>
                <div className="flex items-center gap-1.5">
                  {DEMO_CAROUSEL.map((item, idx) => (
                    <button
                      key={item.style}
                      type="button"
                      onClick={() => setSlideIndex(idx)}
                      className="flex h-6 w-6 items-center justify-center"
                    >
                      <span
                        className={`rounded-full transition-all ${
                          idx === slideIndex
                            ? 'size-2 bg-[#201e19]'
                            : 'size-1.5 bg-[#cac5bc] hover:bg-[#716d67]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  aria-label={m['home.auth.next']()}
                  onClick={() =>
                    setSlideIndex((i) => (i + 1) % DEMO_CAROUSEL.length)
                  }
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#716d67] transition-colors hover:bg-[#e8e5df] hover:text-[#171511]"
                >
                  <svg
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m9 18 6-6-6-6"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Auth Form Panel (Light) */}
          <div className="flex min-w-0 flex-col items-center justify-center bg-white p-6 text-neutral-950 md:p-8">
            <div className="w-full max-w-sm">
              <div className="mb-6 flex flex-col items-center text-center">
                <img
                  src="/brand/tattoogenerator-logo.svg"
                  alt={m['home.brand_logo_alt']()}
                  className="mb-3 size-8 rounded-md"
                />
                <h3 className="text-base font-semibold text-neutral-950">
                  {isSignUp
                    ? m['home.auth.signup_title']()
                    : m['home.auth.signin_title']()}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                  {isSignUp
                    ? m['home.auth.signup_desc']()
                    : m['home.auth.signin_desc']()}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-neutral-900">
                      {m['home.auth.name']()}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={m['home.auth.name_placeholder']()}
                      className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-950 transition-all outline-none placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-neutral-900">
                    {m['home.auth.email']()}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-950 transition-all outline-none placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-xs font-medium text-neutral-900">
                      {m['home.auth.password']()}
                    </label>
                    {!isSignUp && (
                      <Link
                        href="/sign-in"
                        onClick={() => onOpenChange(false)}
                        className="text-[11px] text-neutral-500 hover:text-neutral-900 hover:underline"
                      >
                        {m['home.auth.forgot']()}
                      </Link>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-9 w-full rounded-lg border border-neutral-200 bg-white px-3 py-1 pr-9 text-sm text-neutral-950 transition-all outline-none placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
                    />
                    <button
                      type="button"
                      aria-label={m['home.auth.show_password']()}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-2.5 -translate-y-1/2 text-neutral-400 hover:text-neutral-900"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 text-sm font-medium text-white transition-all hover:bg-neutral-800 disabled:opacity-60"
                >
                  {loading && <Loader2 className="size-4 animate-spin" />}
                  <span>
                    {isSignUp
                      ? m['home.auth.sign_up']()
                      : m['home.auth.sign_in']()}
                  </span>
                </button>
              </form>

              <div className="mt-4">
                <div className="relative mb-4 flex items-center">
                  <div className="grow border-t border-neutral-200" />
                  <span className="mx-3 shrink text-xs text-neutral-500">
                    {m['home.auth.or']()}
                  </span>
                  <div className="grow border-t border-neutral-200" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white text-sm font-medium text-neutral-900 transition-all hover:bg-neutral-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 488 512"
                    className="size-4"
                  >
                    <path
                      fill="currentColor"
                      d="M488 261.8C488 403.3 391.1 504 248 504C110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4"
                    />
                  </svg>
                  <span>{m['home.auth.google']()}</span>
                </button>
              </div>

              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-neutral-500 transition-colors hover:text-neutral-950"
                >
                  {isSignUp
                    ? m['home.auth.to_signin']()
                    : m['home.auth.to_signup']()}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
