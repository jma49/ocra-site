import type { Metadata } from "next";
import { Faq } from "@/components/landing/faq";
import { Features } from "@/components/landing/features";
import { Final } from "@/components/landing/final";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero/hero";
import { HowItWorks } from "@/components/landing/how/how-it-works";
import { Lifecycle } from "@/components/landing/lifecycle/lifecycle";
import { LandingMotion } from "@/components/landing/motion";
import { Plans } from "@/components/landing/plans";
import { Security } from "@/components/landing/security";
import { SiteHeader } from "@/components/landing/site-header";
import { Statement } from "@/components/landing/statement";
import { Works } from "@/components/landing/works";
import { getCopy } from "@/lib/copy";
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
      <SiteHeader copy={{ announce: copy.announce, nav: copy.nav }} locale={lang} />
      <main id="main" className="landing" tabIndex={-1}>
        <Hero copy={copy.hero} window={copy.window} locale={lang} />
        <Works copy={copy.works} />
        <HowItWorks copy={copy.how} />
        <Statement copy={copy.statement} />
        <Features copy={copy.features} />
        <Lifecycle copy={copy.lifecycle} onLine={copy.window.pr.onLine} />
        <Security copy={copy.security} locale={lang} />
        <Plans copy={copy.plans} locale={lang} />
        <Faq copy={copy.faq} />
        <Final copy={copy.final} locale={lang} />
      </main>
      <Footer copy={copy.footer} locale={lang} />
      <LandingMotion />
    </>
  );
}
