import { Faq, Final, Footer } from "@/components/landing/closing";
import { Dock } from "@/components/landing/dock";
import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Lifecycle } from "@/components/landing/lifecycle";
import { Plans } from "@/components/landing/plans";
import { Security } from "@/components/landing/security";
import { SiteHeader } from "@/components/landing/site-header";
import { Statement } from "@/components/landing/statement";
import { Works } from "@/components/landing/works";
import { getCopy } from "@/lib/copy";
import { localeParam } from "@/lib/locale-param";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const lang = await localeParam(params);
  const copy = getCopy(lang);
  return (
    <>
      <SiteHeader copy={copy} locale={lang} />
      <main className="landing">
        <Hero copy={copy} locale={lang} />
        <Works copy={copy.works} />
        <HowItWorks copy={copy.how} />
        <Statement copy={copy.statement} />
        <Features copy={copy.features} />
        <Lifecycle copy={copy.lifecycle} finding={copy.window.pr} />
        <Security copy={copy.security} locale={lang} />
        <Plans copy={copy.plans} locale={lang} />
        <Faq copy={copy.faq} />
        <Final copy={copy.final} locale={lang} />
      </main>
      <Footer copy={copy.footer} locale={lang} />
      <Dock copy={copy.dock} />
    </>
  );
}
