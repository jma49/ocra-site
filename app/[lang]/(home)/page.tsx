import { Anatomy } from "@/components/landing/anatomy";
import { Decisions } from "@/components/landing/decisions";
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
    <>
      <Hero copy={copy.hero} locale={lang} />
      <Stages copy={copy.run} locale={lang} />
      <Anatomy copy={copy.anatomy} locale={lang} />
      <Decisions copy={copy.decisions} locale={lang} />
      <Plugins copy={copy.plugins} locale={lang} />
      <Status copy={copy.status} locale={lang} />
      <GetStarted copy={copy.start} locale={lang} />
    </>
  );
}
