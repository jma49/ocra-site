import { brandIcons } from "@/lib/landing/brand-icons";

// The brand marks as one sprite (components/landing/works.tsx draws them with
// <use>), built once at build time and cached by the browser across pages
// and languages, rather than inlined in every page's HTML and React payload.
export const dynamic = "force-static";

export function GET() {
  const symbols = Object.entries(brandIcons)
    .map(([name, icon]) => `<symbol id="icon-${name}" viewBox="0 0 24 24">${icon.body}</symbol>`)
    .join("");
  return new Response(`<svg xmlns="http://www.w3.org/2000/svg">${symbols}</svg>`, {
    headers: { "Content-Type": "image/svg+xml" },
  });
}
