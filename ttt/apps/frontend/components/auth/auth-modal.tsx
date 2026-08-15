"use client";

import React, { useActionState, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, EyeOff, Sparkles } from "lucide-react";
import Link from "next/link";
import { login } from "@/app/login/actions";
import { signup } from "@/app/signup/actions";

interface AuthModalProps {
  isOpen: boolean;
  mode: "login" | "signup";
  onClose: () => void;
  onSwitchMode: (mode: "login" | "signup") => void;
}

export function AuthModal({ isOpen, mode, onClose, onSwitchMode }: AuthModalProps) {
  const [loginState, loginFormAction, isLoginPending] = useActionState(login, null);
  const [signupState, signupFormAction, isSignupPending] = useActionState(signup, null);
  const [showPassword, setShowPassword] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop with blur & dim effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer"
          />

          {/* Neobrutalist Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="relative z-10 w-full max-w-md rounded-2xl border-4 border-black bg-white p-6 sm:p-8 shadow-[10px_10px_0px_0px_#000] dark:bg-[#141414] dark:border-white dark:shadow-[10px_10px_0px_0px_#D90429] my-8"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              type="button"
              aria-label="Close modal"
              className="absolute right-4 top-4 rounded-xl border-2 border-black bg-white p-2 font-black text-black hover:bg-[#D90429] hover:text-white shadow-[2px_2px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all dark:bg-zinc-800 dark:text-white dark:border-white dark:hover:bg-[#D90429]"
            >
              <X className="h-4 w-4 stroke-[3]" />
            </button>

            {/* Header Badge */}
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border-2 border-black bg-[#fdecef] px-3 py-1 text-xs font-black uppercase text-[#D90429] shadow-[2px_2px_0px_0px_#000]">
              <Sparkles className="h-3.5 w-3.5" />
              Tea Tech Talks
            </div>

            {/* Neobrutalist Tab Selector */}
            <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border-3 border-black bg-gray-100 p-1.5 shadow-[4px_4px_0px_0px_#000] dark:bg-zinc-900 dark:border-white">
              <button
                type="button"
                onClick={() => onSwitchMode("login")}
                className={`rounded-lg py-2.5 text-xs font-black uppercase tracking-wider transition-all border-2 ${
                  mode === "login"
                    ? "bg-[#D90429] text-white border-black shadow-[2px_2px_0px_0px_#000]"
                    : "border-transparent text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                }`}
              >
                LOGIN
              </button>
              <button
                type="button"
                onClick={() => onSwitchMode("signup")}
                className={`rounded-lg py-2.5 text-xs font-black uppercase tracking-wider transition-all border-2 ${
                  mode === "signup"
                    ? "bg-[#D90429] text-white border-black shadow-[2px_2px_0px_0px_#000]"
                    : "border-transparent text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
                }`}
              >
                SIGN UP
              </button>
            </div>

            {/* LOGIN FORM */}
            {mode === "login" && (
              <form action={loginFormAction} className="space-y-4">
                {loginState?.error && (
                  <div className="rounded-xl border-2 border-black bg-red-100 p-3 text-xs font-bold text-red-800 shadow-[3px_3px_0px_0px_#000]">
                    ⚠️ {loginState.error}
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-black uppercase tracking-wider text-black dark:text-gray-200" htmlFor="modal-email">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    id="modal-email"
                    required
                    placeholder="name@example.com"
                    className="h-11 w-full rounded-xl border-2 border-black bg-gray-50 px-4 text-sm font-bold text-black placeholder:text-gray-400 outline-none focus:border-[#D90429] focus:ring-2 focus:ring-[#D90429] shadow-[3px_3px_0px_0px_#000] dark:bg-zinc-900 dark:text-white dark:border-white transition-all"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-black uppercase tracking-wider text-black dark:text-gray-200" htmlFor="modal-password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      id="modal-password"
                      required
                      placeholder="••••••••"
                      className="h-11 w-full rounded-xl border-2 border-black bg-gray-50 px-4 text-sm font-bold text-black placeholder:text-gray-400 outline-none focus:border-[#D90429] focus:ring-2 focus:ring-[#D90429] shadow-[3px_3px_0px_0px_#000] dark:bg-zinc-900 dark:text-white dark:border-white transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 stroke-[2.5]" /> : <Eye className="h-4 w-4 stroke-[2.5]" />}
                    </button>
                  </div>
                  <div className="mt-1.5 flex justify-end">
                    <Link
                      href="/forgot-password"
                      onClick={onClose}
                      className="text-xs font-bold text-[#D90429] hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoginPending}
                  className="mt-2 h-12 w-full rounded-xl border-3 border-black bg-[#D90429] text-sm font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50"
                >
                  {isLoginPending ? "LOGGING IN..." : "LOGIN"}
                </button>

                <div className="relative my-4 flex items-center justify-center">
                  <div className="w-full border-t-2 border-gray-300 dark:border-zinc-700" />
                  <span className="absolute bg-white px-2 text-[10px] font-black uppercase tracking-wider text-gray-500 dark:bg-[#141414]">
                    OR
                  </span>
                </div>

                <button
                  type="button"
                  className="h-11 w-full rounded-xl border-2 border-black bg-white font-bold uppercase tracking-wider text-xs text-black shadow-[3px_3px_0px_0px_#000] hover:bg-gray-50 hover:translate-x-[1px] hover:translate-y-[1px] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center justify-center gap-3 dark:bg-zinc-800 dark:text-white dark:border-white"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <p className="mt-4 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => onSwitchMode("signup")}
                    className="font-black text-[#D90429] underline uppercase"
                  >
                    Sign up
                  </button>
                </p>
              </form>
            )}

            {/* SIGNUP FORM */}
            {mode === "signup" && (
              <form action={signupFormAction} className="space-y-3">
                {signupState?.error && (
                  <div className="rounded-xl border-2 border-black bg-red-100 p-3 text-xs font-bold text-red-800 shadow-[3px_3px_0px_0px_#000]">
                    ⚠️ {signupState.error}
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-black uppercase tracking-wider text-black dark:text-gray-200" htmlFor="signup-name">
                    Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    id="signup-name"
                    required
                    placeholder="John Doe"
                    className="h-10 w-full rounded-xl border-2 border-black bg-gray-50 px-3 text-xs font-bold text-black placeholder:text-gray-400 outline-none focus:border-[#D90429] focus:ring-2 focus:ring-[#D90429] shadow-[3px_3px_0px_0px_#000] dark:bg-zinc-900 dark:text-white dark:border-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-black uppercase tracking-wider text-black dark:text-gray-200" htmlFor="signup-age">
                      Age
                    </label>
                    <input
                      name="age"
                      type="number"
                      id="signup-age"
                      required
                      min="10"
                      max="100"
                      placeholder="19"
                      className="h-10 w-full rounded-xl border-2 border-black bg-gray-50 px-3 text-xs font-bold text-black placeholder:text-gray-400 outline-none focus:border-[#D90429] focus:ring-2 focus:ring-[#D90429] shadow-[3px_3px_0px_0px_#000] dark:bg-zinc-900 dark:text-white dark:border-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-black uppercase tracking-wider text-black dark:text-gray-200" htmlFor="signup-roll">
                      Roll No.
                    </label>
                    <input
                      name="roll_no"
                      type="text"
                      id="signup-roll"
                      required
                      placeholder="101"
                      className="h-10 w-full rounded-xl border-2 border-black bg-gray-50 px-3 text-xs font-bold text-black placeholder:text-gray-400 outline-none focus:border-[#D90429] focus:ring-2 focus:ring-[#D90429] shadow-[3px_3px_0px_0px_#000] dark:bg-zinc-900 dark:text-white dark:border-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-xs font-black uppercase tracking-wider text-black dark:text-gray-200" htmlFor="signup-class">
                      Class
                    </label>
                    <input
                      name="class_name"
                      type="text"
                      id="signup-class"
                      required
                      placeholder="FYBSc"
                      className="h-10 w-full rounded-xl border-2 border-black bg-gray-50 px-3 text-xs font-bold text-black placeholder:text-gray-400 outline-none focus:border-[#D90429] focus:ring-2 focus:ring-[#D90429] shadow-[3px_3px_0px_0px_#000] dark:bg-zinc-900 dark:text-white dark:border-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-black uppercase tracking-wider text-black dark:text-gray-200" htmlFor="signup-div">
                      Div
                    </label>
                    <input
                      name="div"
                      type="text"
                      id="signup-div"
                      required
                      placeholder="A"
                      className="h-10 w-full rounded-xl border-2 border-black bg-gray-50 px-3 text-xs font-bold text-black placeholder:text-gray-400 outline-none focus:border-[#D90429] focus:ring-2 focus:ring-[#D90429] shadow-[3px_3px_0px_0px_#000] dark:bg-zinc-900 dark:text-white dark:border-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-black uppercase tracking-wider text-black dark:text-gray-200" htmlFor="signup-email">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    id="signup-email"
                    required
                    placeholder="name@example.com"
                    className="h-10 w-full rounded-xl border-2 border-black bg-gray-50 px-3 text-xs font-bold text-black placeholder:text-gray-400 outline-none focus:border-[#D90429] focus:ring-2 focus:ring-[#D90429] shadow-[3px_3px_0px_0px_#000] dark:bg-zinc-900 dark:text-white dark:border-white transition-all"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-black uppercase tracking-wider text-black dark:text-gray-200" htmlFor="signup-password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      id="signup-password"
                      required
                      placeholder="Create password"
                      className="h-10 w-full rounded-xl border-2 border-black bg-gray-50 px-3 text-xs font-bold text-black placeholder:text-gray-400 outline-none focus:border-[#D90429] focus:ring-2 focus:ring-[#D90429] shadow-[3px_3px_0px_0px_#000] dark:bg-zinc-900 dark:text-white dark:border-white transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4 stroke-[2.5]" /> : <Eye className="h-4 w-4 stroke-[2.5]" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSignupPending}
                  className="mt-3 h-12 w-full rounded-xl border-3 border-black bg-[#D90429] text-sm font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50"
                >
                  {isSignupPending ? "SIGNING UP..." : "CREATE ACCOUNT"}
                </button>

                <p className="mt-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => onSwitchMode("login")}
                    className="font-black text-[#D90429] underline uppercase"
                  >
                    Log in
                  </button>
                </p>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
