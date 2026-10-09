"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { clientScriptProps, themeOptions } from "@/lib/theme";

// The landing page and the 404 page need only the theme; Fumadocs'
// RootProvider (search, i18n UI, scroll lock) stays with the manual.
export function LandingTheme({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider {...themeOptions} scriptProps={clientScriptProps}>
      {children}
    </ThemeProvider>
  );
}
