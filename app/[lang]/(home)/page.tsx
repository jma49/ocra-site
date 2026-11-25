import type { Metadata } from "next";
import { Faq } from "@/components/landing/faq";
import { Final } from "@/components/landing/final";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { How } from "@/components/landing/how";
import { Limits } from "@/components/landing/limits";
import { Plans } from "@/components/landing/plans";
import { Product } from "@/components/landing/product";
import { Proof } from "@/components/landing/proof";
import { Providers } from "@/components/landing/providers";
import { Quiet } from "@/components/landing/quiet";
import { Record } from "@/components/landing/record";
import { Security } from "@/components/landing/security";
import { SiteHeader } from "@/components/landing/site-header";
import { getCopy } from "@/lib/copy";
import { homeJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { localeParam } from "@/lib/locale-param";
import { alternates } from "@/lib/seo";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { alternates: alternates(await localeParam(params), "/") };
}

export default async function HomePage({ params }: Props) {
  const lang = await localeParam(params);
  const copy = getCopy(lang);
  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: serialized server-side JSON-LD with "<" escaped
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(homeJsonLd(lang, copy)) }}
      />
      <SiteHeader copy={copy.nav} locale={lang} />
      <main id="main" className="landing" tabIndex={-1}>
        <Hero copy={copy.hero} locale={lang} />
        <Proof copy={copy.proof} />
        <Quiet copy={copy.quiet} />
        <How copy={copy.how} />
        <Product copy={copy.product} />
        <Record copy={copy.record} />
        <Providers copy={copy.providers} />
        <Limits copy={copy.limits} />
        <Security copy={copy.security} locale={lang} />
        <Plans copy={copy.plans} locale={lang} />
        <Faq copy={copy.faq} locale={lang} />
        <Final copy={copy.final} />
      </main>
      <Footer copy={copy.footer} locale={lang} />
    </>
  );
}
