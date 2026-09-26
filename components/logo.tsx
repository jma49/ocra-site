// Solid fills on purpose: the layout renders the logo more than once, and
// gradient ids would collide, leaving hidden copies to own the definitions.
export function LogoMark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width="32" height="32" rx="8" fill="#121a19" />
      <rect
        x=".5"
        y=".5"
        width="31"
        height="31"
        rx="7.5"
        fill="none"
        stroke="#fff"
        strokeOpacity=".12"
      />
      <path
        d="M7 10.5h7M7 21.5h9"
        stroke="#fff"
        strokeOpacity=".28"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M7 16h11"
        stroke="#7cb8ff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle
        cx="21"
        cy="16"
        r="5.6"
        fill="none"
        stroke="#4a90f0"
        strokeWidth="2.8"
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
