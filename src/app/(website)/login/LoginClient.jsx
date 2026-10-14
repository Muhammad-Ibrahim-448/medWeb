'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/common/Button';
import { cn } from '@/lib/helpers';

export default function LoginClient({ redirect }) {
  const router = useRouter();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(
        formData.email,
        formData.password
      );

      let target = '/';

      if (redirect) {
        target = redirect;
      } else if (user.role === 'admin') {
        target = '/dashboard';
      }

      router.replace(target);
      router.refresh();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f5f2] px-5 pb-20 pt-32">
      <div className="mx-auto flex min-h-[calc(100vh-180px)] max-w-[1440px] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full max-w-[460px]"
        >
          {/* ─────────────────────────────────────────────
              Header
          ───────────────────────────────────────────── */}

          <div className="mb-8 text-center">
            <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-[#866b42]">
              Shoaib Jewellers
            </p>

            <h1 className="mt-4 font-serif text-4xl leading-none tracking-[-0.03em] text-[#171717] sm:text-5xl">
              Welcome back.
            </h1>

            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="h-px w-9 bg-[#b9b4ad]" />
              <div className="h-1.5 w-1.5 rotate-45 bg-[#866b42]" />
              <div className="h-px w-9 bg-[#b9b4ad]" />
            </div>

            <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-[#66615b]">
              Sign in to access your saved pieces, orders, and
              account.
            </p>
          </div>

          {/* ─────────────────────────────────────────────
              Form Card
          ───────────────────────────────────────────── */}

          <div className="border border-[#d9d5cf] bg-white">
            <div className="border-b border-[#d9d5cf] px-6 py-4 sm:px-8">
              <div className="flex items-center gap-2">
                <ShieldCheck
                  className="h-4 w-4 text-[#866b42]"
                  strokeWidth={1.35}
                />

                <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#66615b]">
                  Secure account access
                </span>
              </div>
            </div>

            <div className="px-6 py-7 sm:px-8 sm:py-8">
              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mb-6 flex items-start gap-3 border border-[#e0c8c4] bg-[#faf5f4] px-4 py-3.5 text-sm text-[#8d4b45]"
                    role="alert"
                  >
                    <AlertCircle
                      className="mt-0.5 h-4 w-4 shrink-0"
                      strokeWidth={1.4}
                    />

                    <span className="leading-5">
                      {error}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[10px] font-medium uppercase tracking-[0.16em] text-[#66615b]"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#99938b]"
                      strokeWidth={1.35}
                    />

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={cn(
                        'h-12 w-full border border-[#d9d5cf] bg-[#f6f5f2]',
                        'pl-11 pr-4 text-sm text-[#171717]',
                        'placeholder:text-[#aaa49c]',
                        'outline-none transition-all duration-200',
                        'focus:border-[#866b42] focus:bg-white',
                        'focus:ring-1 focus:ring-[#866b42]/20'
                      )}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-[10px] font-medium uppercase tracking-[0.16em] text-[#66615b]"
                    >
                      Password
                    </label>
                  </div>

                  <div className="relative">
                    <Lock
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#99938b]"
                      strokeWidth={1.35}
                    />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className={cn(
                        'h-12 w-full border border-[#d9d5cf] bg-[#f6f5f2]',
                        'pl-11 pr-12 text-sm text-[#171717]',
                        'placeholder:text-[#aaa49c]',
                        'outline-none transition-all duration-200',
                        'focus:border-[#866b42] focus:bg-white',
                        'focus:ring-1 focus:ring-[#866b42]/20'
                      )}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((prev) => !prev)
                      }
                      aria-label={
                        showPassword
                          ? 'Hide password'
                          : 'Show password'
                      }
                      className={cn(
                        'absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2',
                        'items-center justify-center',
                        'text-[#99938b] transition-colors duration-200',
                        'hover:bg-[#ebe9e5] hover:text-[#171717]'
                      )}
                    >
                      {showPassword ? (
                        <EyeOff
                          className="h-4 w-4"
                          strokeWidth={1.35}
                        />
                      ) : (
                        <Eye
                          className="h-4 w-4"
                          strokeWidth={1.35}
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    'group mt-2 flex h-12 w-full items-center justify-center gap-3',
                    'border-0 bg-[#181716] px-5',
                    'text-[10px] font-medium uppercase tracking-[0.18em] text-white',
                    'transition-colors duration-300',
                    'hover:bg-[#302d29]',
                    'disabled:cursor-not-allowed disabled:opacity-60'
                  )}
                >
                  {loading ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Signing in
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        strokeWidth={1.4}
                      />
                    </>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-[#d9d5cf]" />

                <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-[#aaa49c]">
                  or
                </span>

                <div className="h-px flex-1 bg-[#d9d5cf]" />
              </div>

              {/* Register */}
              <p className="text-center text-sm text-[#66615b]">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="font-medium text-[#866b42] transition-colors duration-200 hover:text-[#5f4a2e]"
                >
                  Create one
                </Link>
              </p>
            </div>
          </div>

         

          {/* Footer reassurance */}
          <p className="mt-6 text-center text-[9px] uppercase tracking-[0.2em] text-[#aaa49c]">
            Your account information is kept secure
          </p>
        </motion.div>
      </div>
    </main>
  );
}