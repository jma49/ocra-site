import { Google_Sans_Flex } from "next/font/google";

// The display face: every heading and figure on the landing page, set at
// weight 500 (DESIGN.md, Type). The only preloaded face. Text is Geist and
// code JetBrains Mono, the console's and the manual's faces, loaded from
// @fontsource in the stylesheets (site.css, manual.css) and not preloaded.
// Chinese falls through to the system faces in global.css.
const display = Google_Sans_Flex({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-google-sans",
  display: "swap",
  // next/font has no metrics for this face to size a fallback with.
  adjustFontFallback: false,
});

// The class that defines the font variable, for an <html> element.
export const fontVariables = display.variable;
