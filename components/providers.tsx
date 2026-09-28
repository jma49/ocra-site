"use client";

import { FrameworkProvider } from "fumadocs-core/framework";
import { RootProvider } from "fumadocs-ui/provider/base";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { i18n } from "@/lib/i18n";

const hiddenPrefix = `/${i18n.defaultLanguage}`;

// The middleware serves /docs/x from the prerendered /en/docs/x, so on the
// server Next reports the rewritten path while the browser reports the
// visible one. Stripping the hidden default-language prefix gives both the
// same path, which keeps Fumadocs' active links and pagination identical
// on server and client (otherwise React discards the server HTML).
function useVisiblePathname(): string {
  const pathname = usePathname();
  if (pathname === hiddenPrefix) return "/";
  return pathname.startsWith(`${hiddenPrefix}/`)
    ? pathname.slice(hiddenPrefix.length)
    : pathname;
}

// Fumadocs hands links plain anchor props; Next's Link needs an href.
function FrameworkLink({
  href = "#",
  ref: _ref,
  ...props
}: ComponentProps<"a"> & { prefetch?: boolean }) {
  return <Link href={href} {...props} />;
}

// next-themes renders its theme script inline. When React renders the tree on
// the client (a dev remount, or recovery from a hydration error) it warns
// about that script; typed as data on the client, it renders silently. The
// server HTML keeps the executable script, which is the one that runs.
const clientScriptProps =
  typeof window === "undefined" ? undefined : { type: "application/json" };

export function Providers({
  theme,
  ...props
}: ComponentProps<typeof RootProvider>) {
  return (
    <FrameworkProvider
      usePathname={useVisiblePathname}
      useRouter={useRouter}
      useParams={useParams}
      Link={FrameworkLink}
    >
      <RootProvider
        {...props}
        theme={{ ...theme, scriptProps: clientScriptProps }}
      />
    </FrameworkProvider>
  );
}
