import type { ReactNode } from "react";

// The grounds a desk section stands on (06-desk.css). The desk: ink-teal
// with a fine grain, lit by one warm lamp that answers the pointer (--lx,
// --ly, motion/pointer.ts) and falls off to the sides. The light travels
// with the camera through a tall section and fades out at every section's
// top and bottom, so two desk sections meet without a seam. The evening
// desk: the room light down, one lamp. Put it first in a section whose
// `ground` is "desk" or "desk-evening"; it fills the section and sits under
// its content.
export function DeskGround({
  evening = false,
  reach = false,
}: {
  evening?: boolean;
  reach?: boolean;
}) {
  return (
    <div
      className={["desk-ground", evening && "eve", reach && "reach"].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      <div className="desk-light">
        <div className="desk-lamp" />
        <div className="desk-fall" />
      </div>
    </div>
  );
}

// A paper band: a full-bleed sheet lying on the desk. Its top edge slides
// over the desk above as it enters (a scroll timeline), with a soft contact
// shadow; type is printed on it. Use it inside a section whose ground is
// "paper-band"; `children` is the band's content.
export function PaperBand({ children }: { children: ReactNode }) {
  return (
    <div className="paper-band">
      <div className="paper-band-sh" aria-hidden="true" />
      <div className="paper-band-face">{children}</div>
    </div>
  );
}
