export const appName = "ocra";
export const docsRoute = "/docs";

export const gitConfig = {
  user: "jma49",
  repo: "Open-CR-Agent",
  branch: "main",
};

export const repoUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

// English lives at the root and other languages under their prefix.
export function localePath(locale: string, path: string): string {
  return locale === "en" ? path : `/${locale}${path === "/" ? "" : path}`;
}

// ocra Cloud's console; the landing page's sign-in and "start" links.
export const cloudUrl = "https://app.ocracloud.com";
