"use client";

import { useEffect } from "react";

// Below 600 px every answer starts closed (the page is long on a phone). The
// server renders the first answer open, for wider screens and for no
// JavaScript; this closes it on a phone once hydrated, while the list is
// still far below the fold.
export function FaqPhones() {
  useEffect(() => {
    if (!matchMedia("(max-width: 599px)").matches) return;
    for (const d of document.querySelectorAll<HTMLDetailsElement>(".faq-list details[open]")) {
      d.open = false;
    }
  }, []);
  return null;
}
