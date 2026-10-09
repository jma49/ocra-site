import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    // One static 404 for every path the site does not have
    // (app/global-not-found.tsx): the root layout is app/[lang]/layout.tsx,
    // so there is no layout outside the languages to build it from.
    globalNotFound: true,
  },
  // English has no prefix (lib/i18n.ts, hideLocale: "default-locale"). Fixed
  // rules here run in the router, ahead of the CDN cache; a proxy.ts doing
  // the same costs a function invocation on every request.
  async redirects() {
    return [
      // On its own, /:path* would answer /en with an empty Location.
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path+", destination: "/:path+", permanent: true },
    ];
  },
  async rewrites() {
    return {
      // The home page before the files: on Vercel a rewrite of / after them
      // would lose the .rsc suffix of a client navigation's request.
      beforeFiles: [{ source: "/", destination: "/en" }],
      // Any other path after the files, so the icons, the share card, the
      // sitemap, robots.txt, the search API and public/ answer first.
      afterFiles: [{ source: "/:path((?!(?:en|zh)(?:/|$)).+)", destination: "/en/:path" }],
    };
  },
};

export default withMDX(config);
