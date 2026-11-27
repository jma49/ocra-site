import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
} from "@fumadocs/base-ui/layouts/notebook/page";
import { createRelativeLink } from "@fumadocs/base-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageFoot } from "@/components/docs/page-foot";
import { getMDXComponents } from "@/components/mdx";
import { getCopy } from "@/lib/copy";
import { docsPath } from "@/lib/doc-paths";
import { docJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { localeParam } from "@/lib/locale-param";
import { alternates, social } from "@/lib/seo";
import { gitConfig, repoUrl } from "@/lib/shared";
import { docLanguages, source } from "@/lib/source";

type Props = { params: Promise<{ lang: string; slug?: string[] }> };

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const lang = await localeParam(params);
  const page = source.getPage(slug, lang);
  if (!page) notFound();
  const MDX = page.data.body;
  const path = docsPath(page.slugs);
  const ld = docJsonLd({
    locale: lang,
    path,
    title: page.data.title,
    description: page.data.description,
    docsLabel: getCopy(lang).nav.links.docs,
  });

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      footer={{ component: <PageFoot locale={lang} url={page.url} /> }}
    >
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: serialized server-side JSON-LD with "<" escaped
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(ld) }}
      />
      <DocsTitle>{page.data.title}</DocsTitle>
      {/* A subhead, so no closing full stop (the metadata keeps it). */}
      <DocsDescription>{page.data.description?.replace(/[.。]$/, "")}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents(lang, { a: createRelativeLink(source, page) })} />
      </DocsBody>
      <EditOnGitHub href={`${repoUrl}/blob/${gitConfig.branch}/docs/manual/${page.path}`} />
    </DocsPage>
  );
}

// Only the manual's pages exist; any other slug is the static 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return source.generateParams("slug", "lang");
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const locale = await localeParam(params);
  const page = source.getPage(slug, locale);
  if (!page) notFound();
  const path = docsPath(page.slugs);
  return {
    title: page.data.title,
    description: page.data.description,
    alternates: alternates(locale, path, docLanguages.get(path) ?? []),
    ...social({
      locale,
      path,
      title: page.data.title,
      description: page.data.description,
    }),
  };
}
