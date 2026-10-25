import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";

// A callout in the manual is an index card lying on the printed page: white
// stock, a printed head row with its red rule, pale blue lines under the text
// (app/docs.css, `.docs-card`). The head names the kind in type, so a warning
// reads as one without its colour.
type Kind = "info" | "warning" | "error" | "success" | "idea";

const ALIAS: Record<string, Kind> = { warn: "warning", tip: "idea" };

const LABELS: Record<Locale, Record<Kind, string>> = {
  en: { info: "note", warning: "warning", error: "critical", success: "done", idea: "tip" },
  zh: { info: "说明", warning: "注意", error: "严重", success: "完成", idea: "提示" },
};

export function IndexCard({
  locale,
  type = "info",
  title,
  children,
}: {
  locale: Locale;
  type?: string;
  title?: ReactNode;
  children?: ReactNode;
}) {
  const kind = ALIAS[type] ?? (type in LABELS.en ? (type as Kind) : "info");
  return (
    <aside className="docs-card" data-kind={kind}>
      <p className="docs-card-head">
        <span className="docs-card-kind">{LABELS[locale][kind]}</span>
        {title ? <span className="docs-card-title">{title}</span> : null}
      </p>
      <div className="docs-card-body">{children}</div>
    </aside>
  );
}
