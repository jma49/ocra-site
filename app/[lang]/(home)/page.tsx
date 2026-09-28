import { Anatomy } from "@/components/landing/anatomy";
import { Decisions } from "@/components/landing/decisions";
import { Footer } from "@/components/landing/footer";
import { GetStarted } from "@/components/landing/get-started";
import { Hero } from "@/components/landing/hero";
import { Plugins } from "@/components/landing/plugins";
import { Stages } from "@/components/landing/stages";
import { Status } from "@/components/landing/status";
import { getCopy } from "@/lib/copy";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const copy = getCopy(lang);
  return (
    <div className="relative flex flex-1 flex-col">
      <Hero copy={copy.hero} locale={lang} />
      <Stages copy={copy.run} locale={lang} />
      <Decisions copy={copy.decisions} />
      <Anatomy copy={copy.anatomy} />
      <Plugins copy={copy.plugins} locale={lang} />
      <Status copy={copy.status} />
      <GetStarted copy={copy.start} locale={lang} />
      <Footer copy={copy.footer} locale={lang} />
    </div>
  );
}
