"use client";

import React, { createContext, useContext, useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { AuthModal } from "@/components/auth/auth-modal";

type AuthMode = "login" | "signup";

interface AuthModalContextType {
  isOpen: boolean;
  mode: AuthMode;
  openModal: (mode?: AuthMode) => void;
  closeModal: () => void;
  setMode: (mode: AuthMode) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

function AuthModalQueryParamsSync({
  setMode,
  setIsOpen,
}: {
  setMode: (mode: AuthMode) => void;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const authParam = searchParams.get("auth");
    if (authParam === "login") {
      setMode("login");
      setIsOpen(true);
    } else if (authParam === "signup") {
      setMode("signup");
      setIsOpen(true);
    }
  }, [searchParams, setMode, setIsOpen]);

  return null;
}

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const router = useRouter();
  const pathname = usePathname();

  const openModal = (initialMode: AuthMode = "login") => {
    setMode(initialMode);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    // Remove search param from URL if present
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (url.searchParams.has("auth")) {
        url.searchParams.delete("auth");
        router.replace(url.pathname + url.search, { scroll: false });
      }
    }
  };

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        openModal,
        closeModal,
        setMode,
      }}
    >
      {children}
      <Suspense fallback={null}>
        <AuthModalQueryParamsSync setMode={setMode} setIsOpen={setIsOpen} />
      </Suspense>
      <AuthModal
        isOpen={isOpen}
        mode={mode}
        onClose={closeModal}
        onSwitchMode={(newMode) => setMode(newMode)}
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
