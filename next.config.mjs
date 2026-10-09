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
};

export default withMDX(config);
