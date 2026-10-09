import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

// Scripts may be inline: every prerendered page carries its own inline React
// Server Components payload (self.__next_f.push), besides next-themes' and
// the 404 page's constant scripts. Hashes would have to list each page's
// payload, and a hash in the list makes browsers ignore 'unsafe-inline';
// nonces need a render per request, which gives up the prerendered,
// CDN-cached pages. The policy still stops scripts, styles, fonts and
// requests from other origins, plugins, <base> rewrites and framing.
// React needs eval in development only. The silk's shader library tests once
// whether eval is allowed and takes its eval-free path when it is not; the
// browser reports that test as a violation, and the silk still draws.
// No third-party script loads today. Vercel Analytics and Speed Insights
// would be same-origin; the preview toolbar (vercel.live) would need
// allowing, and previews are off (vercel.json).
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          // frame-ancestors, for browsers that predate it.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
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
