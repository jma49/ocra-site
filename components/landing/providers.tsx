import { EyesMark } from "@/components/brand/eyes-mark";
import type { Copy } from "@/lib/copy";
import { WALL_MARKS } from "@/lib/landing/provider-marks";

// Where each tile sits on the plane: three columns of seven, every other
// grid line, so the tiles read as diagonal rows once the plane turns.
const SLOTS: [number, number][] = [330, 630, 930].flatMap((left) =>
  [180, 330, 480, 630, 780, 930, 1080].map((top): [number, number] => [left, top]),
);

// The providers wall: a plane of tiles, one per provider's mark, tilted on
// an isometric grid behind the headline (50-providers.css).
export function Providers({ copy }: { copy: Copy["providers"] }) {
  return (
    <section id="providers" className="sec" aria-labelledby="providers-h">
      <div className="wrap">
        <div className="prov">
          <div className="prov-text">
            <h2 className="h2" id="providers-h">
              <span className="prov-chip">
                <EyesMark size={40} />
                {copy.before}
              </span>{" "}
              {copy.after}
            </h2>
            <p className="lead">{copy.body}</p>
          </div>
          <div className="prov-art">
            <ul className="prov-plane" aria-label={copy.label}>
              {SLOTS.map(([left, top], i) => {
                const m = WALL_MARKS[i];
                if (!m) return null;
                return (
                  <li key={m.id} className="pt" style={{ left, top }}>
                    {"src" in m ? (
                      // biome-ignore lint/performance/noImgElement: a 24-unit SVG mark
                      <img src={m.src} alt={m.id} width={46} height={46} loading="lazy" />
                    ) : (
                      <svg width="46" height="46" viewBox="0 0 24 24" role="img" aria-label={m.id}>
                        {m.d.map((d) => (
                          <path key={d} d={d} fillRule={m.evenodd ? "evenodd" : undefined} />
                        ))}
                      </svg>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
