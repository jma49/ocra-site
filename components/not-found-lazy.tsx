"use client";

import dynamic from "next/dynamic";

// Every page under [lang] carries the 404 boundary, so the 404 page (and
// the Fumadocs layout it uses) is loaded only when it renders.
export const LazyNotFoundPage = dynamic(() =>
  import("./not-found-page").then((m) => m.NotFoundPage),
);
