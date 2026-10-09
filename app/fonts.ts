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
// Every terminal and code sample is set in Maple Mono (maintainer's rule),
// cut down to the characters code on the site uses (scripts/subset-mono.py).
// Not preloaded: no code is part of the first paint on a phone, and a
// preload competes with the stylesheet and Archivo on a slow link. The face
// loads once code is on screen; the fallback shows until then.
const mono = localFont({
  src: [
    { path: "../assets/fonts/ocra-mono-400.woff2", weight: "400" },
    { path: "../assets/fonts/ocra-mono-500.woff2", weight: "500" },
  ],
  variable: "--font-maple",
  preload: false,
});

// The class that defines both font variables, for an <html> element.
export const fontVariables = `${sans.variable} ${mono.variable}`;
