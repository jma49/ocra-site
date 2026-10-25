"use client";

import { useEffect } from "react";

// Below 1024 px every answer starts closed (the page is long in one
// column). The server renders the first answer open, for wider screens and
// for no JavaScript; this closes it once hydrated, while the list is still
// far below the fold.
export function FaqPhones() {
  useEffect(() => {
    if (!matchMedia("(max-width: 1023px)").matches) return;
    for (const d of document.querySelectorAll<HTMLDetailsElement>(".faq-list details[open]")) {
      d.open = false;
    }
  }, []);
  return null;
}
