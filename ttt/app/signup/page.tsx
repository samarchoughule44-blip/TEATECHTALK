'use client'

import Link from "next/link";
import { useActionState, useState } from "react";
import { signup } from "./actions";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, null)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#f5f5f5] px-6 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-10 shadow-[0_8px_40px_rgba(0,0,0,0.14)]">

        {/* Heading */}
        <h1 className="text-center text-4xl font-black tracking-tight text-black mb-1">SIGN UP</h1>
        <p className="text-center text-sm text-gray-500 font-medium mb-8">
          Join the leaderboard today.
        </p>

        {/* Form */}
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
              {state.error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5" htmlFor="name">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              id="name"
              required
              placeholder="Enter your full name"
              className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5" htmlFor="age">
                Age
              </label>
              <input
                name="age"
                type="number"
                id="age"
                required
                min="10"
                max="100"
                placeholder="Age"
                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5" htmlFor="roll_no">
                Roll No.
              </label>
              <input
                name="roll_no"
                type="text"
                id="roll_no"
                required
                placeholder="Roll number"
                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5" htmlFor="class_name">
                Class
              </label>
              <input
                name="class_name"
                type="text"
                id="class_name"
                required
                placeholder="e.g. FYBSc"
                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5" htmlFor="div">
                Div
              </label>
              <input
                name="div"
                type="text"
                id="div"
                required
                placeholder="e.g. A"
                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5" htmlFor="email">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              id="email"
              required
              placeholder="Enter your email"
              className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase tracking-wider mb-1.5" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                id="password"
                required
                placeholder="Create a password"
                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-black focus:ring-1 focus:ring-black transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Signup button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-black text-white font-black uppercase tracking-widest text-sm rounded-lg hover:bg-black transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'SIGNING UP...' : 'SIGN UP'}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-[var(--color-brand)] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
