import { loader } from "fumadocs-core/source";
import { metaSchema, pageSchema } from "fumadocs-core/source/schema";
import { defineDocs } from "fumadocs-mdx/macro";
import { docsPath, indexDocLanguages } from "./doc-paths";
import { i18n } from "./i18n";
import { lucideIconsPlugin } from "./icons";

const docs = defineDocs({
  dir: "content/docs",
  docs: { schema: pageSchema },
  meta: { schema: metaSchema },
});

export const source = loader({
  i18n,
  baseUrl: docsPath(),
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export const docLanguages = indexDocLanguages(i18n.languages, source.getPages);
