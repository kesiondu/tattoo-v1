'use client';

import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { signIn } from '@/core/auth/client';
import { useRouter } from '@/core/i18n/navigation';
import { toast } from 'sonner';
import { m } from '@/paraglide/messages.js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

export function AuthModal({ open, onOpenChange, defaultTab = 'signin' }: AuthModalProps) {
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
        const { signUp } = await import('@/core/auth/client');
        const res = await signUp.email({
          email,
          password,
          name: name || email.split('@')[0],
        });
        if (res.error) {
          toast.error(res.error.message || 'Registration failed');
        } else {
          toast.success('Account created successfully!');
          onOpenChange(false);
          await router.refresh();
        }
      } else {
        const res = await signIn.email({
          email,
          password,
        });
        if (res.error) {
          toast.error(res.error.message || 'Invalid email or password');
        } else {
          toast.success('Signed in successfully!');
          onOpenChange(false);
          await router.refresh();
        }
      }
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
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
      toast.error(err.message || 'Google sign in failed');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-background text-sm ring-1 ring-foreground/10 duration-100 outline-none gap-0 overflow-hidden p-0 max-h-[calc(100dvh-1rem)] overflow-y-auto sm:max-w-[460px] md:w-[960px] md:max-w-[calc(100vw-2rem)] border-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{isSignUp ? 'Create your InkStudio account' : 'Design a tattoo you can actually get'}</DialogTitle>
          <DialogDescription>Sign in to continue and save your design.</DialogDescription>
        </DialogHeader>

        <div className="grid min-w-0 md:grid-cols-2">
          {/* Left Preview Section */}
          <div className="flex min-w-0 flex-col overflow-hidden bg-[#f6f5f2] pt-4 pb-2 md:min-h-[520px] md:justify-center md:py-6">
            <div className="flex w-full min-w-0 shrink-0 flex-col items-center">
              <div className="grid w-full min-w-0 grid-cols-2 items-start gap-2.5 px-3.5 md:gap-3 md:px-[18px]">
                {/* Body Preview */}
                <div className="flex min-w-0 flex-col">
                  <div className="relative isolate h-[clamp(180px,56vw,220px)] w-full overflow-hidden rounded-md bg-[#eeece8] md:aspect-[2/3] md:h-auto shadow-inner">
                    <img
                      src={currentSlide.bodyImg}
                      alt="Body Preview"
                      className="absolute inset-0 h-full w-full object-contain object-center transition-all duration-300"
                    />
                    <span className="pointer-events-none absolute bottom-1.5 left-1/2 z-10 w-max max-w-[calc(100%-12px)] -translate-x-1/2 rounded-md bg-white/85 px-2 py-0.5 text-center text-[11px] font-medium leading-4 text-[#3d3934] md:hidden">
                      Body Preview
                    </span>
                  </div>
                  <span className="hidden min-h-[30px] items-center justify-center px-0.5 py-1.5 text-center text-[11px] font-medium leading-4 text-[#66615b] md:flex md:text-xs">
                    Body Preview
                  </span>
                </div>

                {/* Clean Artwork */}
                <div className="flex min-w-0 flex-col">
                  <div className="relative isolate h-[clamp(180px,56vw,220px)] w-full overflow-hidden rounded-md bg-white md:aspect-[2/3] md:h-auto shadow-inner">
                    <img
                      src={currentSlide.paperImg}
                      alt="Clean Artwork"
                      className="absolute inset-0 h-full w-full object-contain object-center transition-all duration-300"
                    />
                    <span className="pointer-events-none absolute bottom-1.5 left-1/2 z-10 w-max max-w-[calc(100%-12px)] -translate-x-1/2 rounded-md bg-white/85 px-2 py-0.5 text-center text-[11px] font-medium leading-4 text-[#3d3934] md:hidden">
                      Clean Artwork
                    </span>
                  </div>
                  <span className="hidden min-h-[30px] items-center justify-center px-0.5 py-1.5 text-center text-[11px] font-medium leading-4 text-[#66615b] md:flex md:text-xs">
                    Clean Artwork
                  </span>
                </div>
              </div>

              {/* Slider Controls */}
              <div className="mt-3 flex h-8 shrink-0 items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setSlideIndex((i) => (i - 1 + DEMO_CAROUSEL.length) % DEMO_CAROUSEL.length)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#716d67] hover:bg-[#e8e5df] hover:text-[#171511] transition-colors"
                >
                  <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
                  </svg>
                </button>
                <div className="flex items-center gap-1.5">
                  {DEMO_CAROUSEL.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSlideIndex(idx)}
                      className="flex h-6 w-6 items-center justify-center"
                    >
                      <span
                        className={`rounded-full transition-all ${
                          idx === slideIndex ? 'size-2 bg-[#201e19]' : 'size-1.5 bg-[#cac5bc] hover:bg-[#716d67]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setSlideIndex((i) => (i + 1) % DEMO_CAROUSEL.length)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#716d67] hover:bg-[#e8e5df] hover:text-[#171511] transition-colors"
                >
                  <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Right Auth Form */}
          <div className="flex min-w-0 flex-col items-center justify-center bg-card p-6 md:p-8">
            <div className="w-full max-w-sm">
              <div className="flex flex-col items-center text-center mb-6">
                <img
                  src="/brand/inkstudioai-logo-primary.svg"
                  alt="InkStudio.ai logo"
                  className="size-8 rounded-md mb-3"
                />
                <h3 className="text-base font-semibold text-foreground">
                  {isSignUp ? 'Create your account' : 'Design a tattoo you can actually get'}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isSignUp
                    ? 'Start generating tattoo designs, 3D body placements & stencil artwork.'
                    : 'Sign in to continue and save your design. Love it? Turn it into clean artwork to share with your tattoo artist.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="h-8.5 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 transition-all"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="h-8.5 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 transition-all"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-medium text-foreground">Password</label>
                    {!isSignUp && (
                      <a
                        href="/auth/forgot-password"
                        className="text-[11px] text-muted-foreground hover:text-foreground hover:underline"
                      >
                        Forgot Password?
                      </a>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-8.5 w-full rounded-lg border border-input bg-transparent px-3 pr-9 py-1 text-sm outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 h-9 w-full rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {loading && <Loader2 className="size-4 animate-spin" />}
                  <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
                </button>
              </form>

              <div className="mt-4">
                <div className="relative flex items-center mb-4">
                  <div className="grow border-t border-border" />
                  <span className="shrink mx-3 text-xs text-muted-foreground">Or continue with</span>
                  <div className="grow border-t border-border" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="h-9 w-full rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 488 512" className="size-4">
                    <path
                      fill="currentColor"
                      d="M488 261.8C488 403.3 391.1 504 248 504C110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4"
                    />
                  </svg>
                  <span>Sign In with Google</span>
                </button>
              </div>

              <div className="mt-5 text-center">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
