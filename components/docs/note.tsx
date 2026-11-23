import { CircleCheck, Info, Lightbulb, OctagonAlert, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";

// A callout in the manual (app/docs-prose.css, `.docs-note`). The head names
// the kind in words, so a warning reads as one without its colour.
type Kind = "info" | "warning" | "error" | "success" | "idea";

const ALIAS: Record<string, Kind> = { warn: "warning", tip: "idea" };

const LABELS: Record<Locale, Record<Kind, string>> = {
  en: { info: "Note", warning: "Warning", error: "Critical", success: "Done", idea: "Tip" },
  zh: { info: "说明", warning: "注意", error: "严重", success: "完成", idea: "提示" },
};

const ICONS = {
  info: Info,
  warning: TriangleAlert,
  error: OctagonAlert,
  success: CircleCheck,
  idea: Lightbulb,
} satisfies Record<Kind, unknown>;

export function Note({
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
  const Icon = ICONS[kind];
  return (
    <aside className="docs-note" data-kind={kind}>
      <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
      <div>
        <p className="docs-note-head">
          <span className="docs-note-kind">{LABELS[locale][kind]}</span>
          {title}
        </p>
        <div className="docs-note-body">{children}</div>
      </div>
    </aside>
  );
}
