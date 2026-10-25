"use client";

import {
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { EASE, motionAllowed } from "@/components/landing/desk/motion/core";
import { seenAt } from "./seen-ratio";

// The FAQ's file of index cards: an accordion of real buttons, one card open
// at a time (the first, as the server paints it). Arrow keys, Home and End
// move between the questions. With motion the cards are laid into the file
// one after another, a short slide each, their shadows tightening as they
// land, and the open card's number is ticked; a card read later is ticked
// as it opens. Hover lift, tilt and sheen come from the shared [data-lift]
// physics.

const pad = (i: number) => String(i + 1).padStart(2, "0");

export function FaqFile({
  items,
  ticks,
}: {
  items: readonly { q: string; a: string }[];
  ticks: readonly ReactNode[];
}) {
  const [open, setOpen] = useState(0);
  const [read, setRead] = useState<ReadonlySet<number>>(() => new Set([0]));
  const [live, setLive] = useState(false);
  const file = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLive(true);
    const el = file.current;
    const sec = el?.closest<HTMLElement>(".faq");
    const head = sec?.querySelector<HTMLElement>(".fq-head");
    if (!el || !sec || !head || !motionAllowed()) return;
    const rise = seenAt(head, () => head.classList.add("in"), 0.3);
    const deal = seenAt(
      el,
      () => {
        const cards = [...el.querySelectorAll<HTMLElement>(".fq-card")];
        // The open card's number is ticked once the file has landed.
        sec.style.setProperty("--tick-at", "820ms");
        setTimeout(() => sec.style.removeProperty("--tick-at"), 1800);
        sec.classList.add("dealt");
        cards.forEach((card, i) => {
          const lift = card.classList.contains("open") ? 0.3 : 0;
          card.animate(
            [
              { translate: "26px -18px", rotate: "1.2deg", opacity: 0, "--lift": 0.9 },
              { translate: "0px 0px", rotate: "0deg", opacity: 1, "--lift": lift },
            ],
            { duration: 600, delay: i * 70, easing: EASE.settle, fill: "backwards" },
          );
        });
      },
      0.25,
    );
    return () => {
      rise();
      deal();
    };
  }, []);

  const toggle = (i: number) => {
    const next = open === i ? -1 : i;
    setOpen(next);
    if (next < 0) return;
    if (!read.has(next)) setRead(new Set(read).add(next));
    // Pulled out of the file: lifted clear of its neighbours, then laid
    // down pulled out (the CSS transition carries it sideways).
    const card = file.current?.querySelectorAll<HTMLElement>(".fq-card")[next];
    if (card && motionAllowed())
      card.animate(
        [
          { translate: "0 0", "--lift": 0 },
          { translate: "0 -5px", "--lift": 0.75, offset: 0.35 },
          { translate: "0 0", "--lift": 0.3 },
        ],
        { duration: 720, easing: EASE.settle },
      );
  };

  const keys = (e: KeyboardEvent<HTMLDivElement>) => {
    const buttons = [...(file.current?.querySelectorAll<HTMLButtonElement>(".fq-q button") ?? [])];
    const at = buttons.indexOf(e.target as HTMLButtonElement);
    if (at < 0) return;
    const to = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: buttons.length - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    buttons[(to + buttons.length) % buttons.length]?.focus();
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: arrow keys between the questions' buttons
    <div className="fq-file" ref={file} onKeyDown={keys} data-depth="card">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className={["fq-card", isOpen && "open", read.has(i) && "read"]
              .filter(Boolean)
              .join(" ")}
            style={{ "--i": i } as CSSProperties}
          >
            {/* React owns the card's classes; the hover physics owns this one's. */}
            <div className="fq-lift" data-lift="">
              <div className="sh sh-a" aria-hidden="true" />
              <div className="sh sh-c" aria-hidden="true" />
              <div className="fq-face">
                <h3 className="fq-q">
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => toggle(i)}
                  >
                    <span className="fq-n" aria-hidden="true">
                      <span className="fq-num">{pad(i)}</span>
                      {ticks[i]}
                    </span>
                    <span className="fq-t">{item.q}</span>
                    <span className="fq-i" aria-hidden="true" />
                  </button>
                </h3>
                <section
                  className="fq-a"
                  id={`faq-a-${i}`}
                  aria-labelledby={`faq-q-${i}`}
                  inert={live && !isOpen}
                >
                  <div className="fq-a-in">
                    <p>{item.a}</p>
                  </div>
                </section>
                <div className="fq-sheen" aria-hidden="true" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
