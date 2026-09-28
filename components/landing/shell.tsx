import type { ReactNode } from "react";
import { getCopy } from "@/lib/copy";
import { Footer } from "./footer";
import { SiteHeader } from "./site-header";

// The landing page and the 404 page share this frame. It is dark in both
// themes: `.dark` switches every token inside it, whatever the system says.
export function Shell({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  const copy = getCopy(locale);
  return (
    <div id="top" className="landing dark flex flex-1 flex-col">
      <SiteHeader copy={copy.nav} locale={locale} />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer copy={copy.footer} nav={copy.nav} locale={locale} />
    </div>
  );
}
