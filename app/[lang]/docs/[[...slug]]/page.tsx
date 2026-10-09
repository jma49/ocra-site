import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  EditOnGitHub,
} from "@fumadocs/base-ui/layouts/docs/page";
import { createRelativeLink } from "@fumadocs/base-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import { i18n } from "@/lib/i18n";
import { localeParam } from "@/lib/locale-param";
import { alternates, social } from "@/lib/seo";
import { gitConfig, repoUrl } from "@/lib/shared";
import { source } from "@/lib/source";

type Props = { params: Promise<{ lang: string; slug?: string[] }> };

export default async function Page({ params }: Props) {
  const { lang, slug } = await params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();
  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents({ a: createRelativeLink(source, page) })} />
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
  const path = slug ? `/docs/${slug.join("/")}` : "/docs";
  // A page missing in one language has no alternate there.
  const languages = i18n.languages.filter((l) => source.getPage(slug, l));
  return {
    title: page.data.title,
    description: page.data.description,
    alternates: alternates(locale, path, languages),
    ...social({
      locale,
      path,
      title: page.data.title,
      description: page.data.description,
    }),
  };
}
