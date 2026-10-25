"use client";

import { useEffect } from "react";
import { motionAllowed, sleep } from "@/components/landing/desk/motion/core";
import { typeOn } from "@/components/landing/desk/motion/text";

// The security band's played beats (motion.md, Security): its heading rises
// line by line, and once the first redaction bar is mostly inked (the bars
// themselves are a scroll timeline in 51-security.css), the agent's request
// and the gate's refusal are typed, one after the other, and the caret stays.
export function SecurityPlay() {
  useEffect(() => {
    const band = document.getElementById("security");
    const h2 = band?.querySelector<HTMLElement>(".sec-h");
    const row = band?.querySelector<HTMLElement>(".sec-row");
    const says = [...(band?.querySelectorAll<HTMLElement>(".sec-x-say") ?? [])];
    if (!band || !h2 || !row || !motionAllowed()) return;
    const ctl = new AbortController();

    const rise = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        h2.classList.add("risen");
        rise.disconnect();
      },
      { threshold: 0.45 },
    );
    rise.observe(h2);

    const type = async () => {
      for (const say of says) {
        say.parentElement?.classList.add("on");
        await sleep(200, ctl.signal);
        await typeOn(say, { cps: 44, signal: ctl.signal });
        await sleep(260, ctl.signal);
      }
    };
    // When the first row's top has crossed 62 % of the viewport.
    const typed = new IntersectionObserver(
      ([e]) => {
        if (!e) return;
        // Already scrolled past it (a link, a reload): the typed state.
        if (!e.isIntersecting && e.boundingClientRect.bottom < 0) {
          for (const say of says) {
            say.classList.add("typed");
            say.parentElement?.classList.add("on");
          }
          typed.disconnect();
          return;
        }
        if (!e.isIntersecting) return;
        typed.disconnect();
        type().catch(() => {});
      },
      { rootMargin: "0px 0px -38% 0px" },
    );
    typed.observe(row);
    return () => {
      ctl.abort();
      rise.disconnect();
      typed.disconnect();
    };
  }, []);

  return null;
}
