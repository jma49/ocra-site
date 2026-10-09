"use client";

import { RootProvider } from "@fumadocs/base-ui/provider/base";
import { FrameworkProvider } from "fumadocs-core/framework";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { i18n } from "@/lib/i18n";
import { clientScriptProps, themeOptions } from "@/lib/theme";

const hiddenPrefix = `/${i18n.defaultLanguage}`;

// A rewrite (next.config.mjs) serves /docs/x from the prerendered /en/docs/x,
// so on the server Next reports the rewritten path while the browser reports
// the visible one. Stripping the hidden default-language prefix gives both the
// same path, which keeps Fumadocs' active links and pagination identical
// on server and client (otherwise React discards the server HTML).
function useVisiblePathname(): string {
  const pathname = usePathname();
  if (pathname === hiddenPrefix) return "/";
  return pathname.startsWith(`${hiddenPrefix}/`) ? pathname.slice(hiddenPrefix.length) : pathname;
}

// Fumadocs hands links plain anchor props; Next's Link needs an href. The
// ref goes through: the sidebar scrolls its active link into view by it.
function FrameworkLink({ href = "#", ...props }: ComponentProps<"a"> & { prefetch?: boolean }) {
  return <Link href={href} {...props} />;
}

export function Providers({ theme, ...props }: ComponentProps<typeof RootProvider>) {
  return (
    <FrameworkProvider
      usePathname={useVisiblePathname}
      useRouter={useRouter}
      useParams={useParams}
      Link={FrameworkLink}
    >
      <RootProvider
        {...props}
        theme={{ ...themeOptions, ...theme, scriptProps: clientScriptProps }}
        // app/api/search serves the whole index, prebuilt; the dialog fetches
        // it once and filters it by the page's language in the browser.
        search={{ options: { type: "static" } }}
      />
    </FrameworkProvider>
  );
}
