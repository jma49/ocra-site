import type { Bilingual } from "../define";

// Footer links name a destination; components/landing/footer.tsx holds the
// hrefs, so copy carries no URLs.
export type FooterLinkId =
  | "how"
  | "product"
  | "plans"
  | "changelog"
  | "quickstart"
  | "github-action"
  | "gitlab"
  | "providers"
  | "threat-model"
  | "privacy"
  | "security-policy"
  | "quality"
  | "repo"
  | "roadmap"
  | "license"
  | "other-language";

interface FooterCopy {
  tagline: string;
  columns: { title: string; links: { id: FooterLinkId; label: string }[] }[];
}

export const footer: Bilingual<FooterCopy> = {
  en: {
    tagline: "Open-source code review with agents that read first.",
    columns: [
      {
        title: "Product",
        links: [
          { id: "how", label: "How it works" },
          { id: "product", label: "Product" },
          { id: "plans", label: "Pricing" },
          { id: "changelog", label: "Changelog" },
        ],
      },
      {
        title: "Run it",
        links: [
          { id: "quickstart", label: "Quickstart" },
          { id: "github-action", label: "GitHub Action" },
          { id: "gitlab", label: "GitLab" },
          { id: "providers", label: "Model providers" },
        ],
      },
      {
        title: "Trust",
        links: [
          { id: "threat-model", label: "Threat model" },
          { id: "privacy", label: "Data policy" },
          { id: "security-policy", label: "Security policy" },
          { id: "quality", label: "Quality results" },
        ],
      },
      {
        title: "Project",
        links: [
          { id: "repo", label: "GitHub" },
          { id: "roadmap", label: "Roadmap" },
          { id: "license", label: "Apache-2.0" },
          { id: "other-language", label: "中文" },
        ],
      },
    ],
  },
  zh: {
    tagline: "开源的代码审查，agent 先读再评。",
    columns: [
      {
        title: "产品",
        links: [
          { id: "how", label: "工作原理" },
          { id: "product", label: "产品" },
          { id: "plans", label: "价格" },
          { id: "changelog", label: "更新日志" },
        ],
      },
      {
        title: "使用",
        links: [
          { id: "quickstart", label: "快速上手" },
          { id: "github-action", label: "GitHub Action" },
          { id: "gitlab", label: "GitLab" },
          { id: "providers", label: "模型服务商" },
        ],
      },
      {
        title: "信任",
        links: [
          { id: "threat-model", label: "威胁模型" },
          { id: "privacy", label: "数据政策" },
          { id: "security-policy", label: "安全政策" },
          { id: "quality", label: "质量结果" },
        ],
      },
      {
        title: "项目",
        links: [
          { id: "repo", label: "GitHub" },
          { id: "roadmap", label: "路线图" },
          { id: "license", label: "Apache-2.0" },
          { id: "other-language", label: "English" },
        ],
      },
    ],
  },
};
