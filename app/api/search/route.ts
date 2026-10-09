import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

// The index is built once, at build time, and served as a static file; the
// browser searches it itself (components/providers.tsx, type "static").
export const revalidate = false;

export const { staticGET: GET } = createFromSource(source);
