// The one measured quality result the landing page quotes, as ocra's manual
// publishes it with its limits (ocra docs/manual/en/quality.mdx, the opening
// callout; content/docs/en/quality.mdx here): the current configuration's one
// run on the golden smoke tier. A new run updates the manual and this
// constant together (scripts/engine-facts.test.mjs compares them); the page
// states the sample size from it, never a rounded rate.
export const measured = {
  changes: 8,
  known: 16,
  found: 7,
  reported: 7,
  correct: 7,
} as const;

// The copy says every reported finding was correct; a result where that is
// no longer true fails the build instead of shipping the sentence.
if (measured.correct !== measured.reported) {
  throw new Error("measured.ts: not every reported finding was correct; rewrite the proof copy");
}
