import { Fragment } from "react";

type Stage = { name: string; kind: "code" | "model" };

// The pipeline meter above the pinned story (30-how.css shows it only
// there): the ten stages in their four groups, each with its kind shape,
// "n of 4" and an ink progress rule under the row. The story island marks
// stages passed (`is-past`) and active (`is-on`); before it runs, the first
// group is active. Ink only: the pen never marks UI chrome.
export function Meter({
  groups,
  label,
  pass,
}: {
  groups: readonly (readonly Stage[])[];
  label: string;
  pass: string;
}) {
  return (
    <div className="meter-row">
      <ol className="meter" aria-label={label}>
        {groups.map((stages, g) => (
          <Fragment key={stages.map((s) => s.name).join()}>
            {stages.map((stage, i) => (
              <li
                key={stage.name}
                data-stage={stage.name}
                data-g={g + 1}
                data-first={(g > 0 && i === 0) || undefined}
                className={g === 0 ? "is-on" : undefined}
              >
                <i className="k" data-kind={stage.kind} aria-hidden="true" />
                {stage.name}
              </li>
            ))}
          </Fragment>
        ))}
      </ol>
      <p className="meter-pass">{pass}</p>
      <span className="meter-rule" aria-hidden="true" />
    </div>
  );
}
