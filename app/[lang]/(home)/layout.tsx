import type { ReactNode } from "react";
import { LandingTheme } from "@/components/landing-theme";
import "../../site.css";
import "../../landing/index.css";

// The landing page draws its own header and footer (components/landing);
// the manual keeps Fumadocs' layout. The motion gate runs in the root
// layout's <head>, before this renders.
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <LandingTheme>
      <div className="home">{children}</div>
    </LandingTheme>
  );
}
