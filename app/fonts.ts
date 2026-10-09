import { Archivo } from "next/font/google";
import localFont from "next/font/local";

// Latin faces; Chinese falls through to the system fonts in global.css.
// Archivo's width axis carries the whole type scale: condensed black for
// posters, semi-condensed for headings, normal width for text.
const sans = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
});
// Every terminal and code sample is set in Maple Mono (maintainer's rule).
const mono = localFont({
  src: [
    {
      path: "../node_modules/@fontsource/maple-mono/files/maple-mono-latin-400-normal.woff2",
      weight: "400",
    },
    {
      path: "../node_modules/@fontsource/maple-mono/files/maple-mono-latin-500-normal.woff2",
      weight: "500",
    },
  ],
  variable: "--font-maple",
});

// The class that defines both font variables, for an <html> element.
export const fontVariables = `${sans.variable} ${mono.variable}`;
