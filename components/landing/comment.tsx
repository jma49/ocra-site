// The GitHub Action posts as github-actions[bot]; its avatar is the Actions
// mark, drawn as a play glyph in a ring.
export function BotAvatar() {
  return (
    <span className="bot-avatar" aria-hidden="true">
      <svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true">
        <path d="M5.5 3.8v8.4L12 8z" fill="currentColor" />
      </svg>
    </span>
  );
}
