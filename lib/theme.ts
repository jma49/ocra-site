// One theme setup for every provider: the landing page's next-themes and
// Fumadocs' RootProvider read the same class and storage key.
export const themeOptions = {
  attribute: "class",
  defaultTheme: "system",
  enableSystem: true,
  disableTransitionOnChange: true,
} as const;

// next-themes renders its theme script inline. When React renders the tree on
// the client (a dev remount, or recovery from a hydration error) it warns
// about that script; typed as data on the client, it renders silently. The
// server HTML keeps the executable script, which is the one that runs.
export const clientScriptProps =
  typeof window === "undefined" ? undefined : { type: "application/json" };
