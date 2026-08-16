"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // For React 19 / Next.js 15 compatibility: change script type to non-executable
  // on the client to suppress console errors, while keeping normal execution on server.
  const scriptProps = typeof window === "undefined" ? undefined : { type: "application/json" };

  return (
    <NextThemesProvider {...props} scriptProps={scriptProps as any}>
      {children}
    </NextThemesProvider>
  );
}
