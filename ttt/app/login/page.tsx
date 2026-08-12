'use client'

import Link from "next/link";
import { useActionState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#f5f5f5] px-6 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-10 shadow-[0_8px_40px_rgba(0,0,0,0.14)]">

        {/* Heading */}
        <h1 className="text-center text-4xl font-black tracking-tight text-black mb-1">LOGIN</h1>
        <p className="text-center text-sm text-gray-500 font-medium mb-8">
          Access your leaderboard ranking.
        </p>

        {/* Form */}
        <form action={formAction} className="space-y-5">
          {state?.error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
              {state.error}
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-[#D90429] uppercase tracking-wider mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              id="email"
              required
              placeholder="Enter your email"
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm text-[#D90429] placeholder:text-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#D90429] uppercase tracking-wider mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              name="password"
              type="password"
              id="password"
              required
              placeholder="Enter your password"
              className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm text-[#D90429] placeholder:text-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
            <div className="flex justify-end mt-2">
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-[var(--color-brand)] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-13 bg-[var(--color-brand)] text-[#fff] font-black uppercase tracking-widest text-sm py-4 rounded-lg hover:bg-[var(--color-brand-dark)] transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'LOGGING IN...' : 'LOGIN'}
          </button>
        </form>

        {/* Google button */}
        <button className="w-full mt-4 h-12 border-2 border-black rounded-lg font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Sign up link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold text-[var(--color-brand)] hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
