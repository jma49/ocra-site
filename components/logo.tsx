// Solid fills on purpose: the layout renders the logo more than once, and
// gradient ids would collide, leaving hidden copies to own the definitions.
export function LogoMark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="58" height="58" rx="14" fill="#3479e4" />
      <rect x="3" y="33" width="58" height="28" rx="14" fill="#5ea6ff" />
      <rect x="3" y="30" width="58" height="8" fill="#2a6fdc" />
      <rect
        x="3.75"
        y="3.75"
        width="56.5"
        height="56.5"
        rx="13.25"
        fill="none"
        stroke="#123f93"
        strokeWidth="1.5"
      />
      <path
        d="M13 21h14M13 43h18"
        stroke="#fff"
        strokeOpacity=".55"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path d="M13 32h20" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      <path
        d="M47.5 42.5 54 49"
        stroke="#0e2f6e"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d="M47.5 42.5 54 49"
        stroke="#e9eef5"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="40" cy="32" r="10" fill="#fff" fillOpacity=".3" />
      <circle
        cx="40"
        cy="32"
        r="10"
        fill="none"
        stroke="#0e2f6e"
        strokeWidth="6"
      />
      <circle
        cx="40"
        cy="32"
        r="10"
        fill="none"
        stroke="#fff"
        strokeWidth="3.5"
      />
      <path
        d="M8 15a10 10 0 0 1 10-9h28a10 10 0 0 1 10 9c0 7-11 11-24 11S8 22 8 15Z"
        fill="#fff"
        fillOpacity=".45"
      />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark />
      <span className="text-[1.1rem] font-bold lowercase tracking-[-0.04em]">
        ocra
      </span>
    </span>
  );
}
