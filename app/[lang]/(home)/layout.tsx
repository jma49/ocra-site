import type { ReactNode } from "react";
import "../../landing/index.css";

// The landing page draws its own header and footer (components/landing);
// the manual keeps Fumadocs' layout.
export default function Layout({ children }: { children: ReactNode }) {
  return <div className="home">{children}</div>;
}
