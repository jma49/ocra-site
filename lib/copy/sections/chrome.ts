import { CLOUD } from "../brand";
import type { Bilingual } from "../define";

// The page's metadata, the nav and the 404 page. `meta`,
// `nav.links.docs` and `notFound` are read outside the landing page too
// (app/[lang]/layout.tsx, app/[lang]/docs/layout.tsx, app/global-not-found.tsx).

interface MetaCopy {
  title: string;
  description: string;
}

export const meta: Bilingual<MetaCopy> = {
  en: {
    title: "Ocra — code review agents that check before they comment",
    description:
      "Ocra is open-source AI code review for GitHub and GitLab, on your own model key. Its findings quote the code they mean and face a second read before they reach your pull request.",
  },
  zh: {
    title: "Ocra — 先核实，再开口的代码审查 agent",
    description:
      "Ocra 是开源的 AI 代码审查，支持 GitHub 和 GitLab，使用你自己的模型 key：每条意见都引用它所指的代码，并经过第二遍核查，才会出现在你的 PR 里。",
  },
};

interface NavCopy {
  skip: string;
  links: { how: string; product: string; security: string; pricing: string; docs: string };
  github: string;
  signIn: string;
  start: string;
  menu: string;
  close: string;
  theme: string;
  home: string;
  primary: string;
}

export const nav: Bilingual<NavCopy> = {
  en: {
    skip: "Skip to content",
    links: {
      how: "How it works",
      product: "Product",
      security: "Security",
      pricing: "Pricing",
      docs: "Docs",
    },
    github: "GitHub",
    signIn: "Sign in",
    start: `Start with ${CLOUD}`,
    menu: "Open menu",
    close: "Close menu",
    theme: "Dark theme",
    home: "Ocra home",
    primary: "Primary",
  },
  zh: {
    skip: "跳到正文",
    links: {
      how: "工作原理",
      product: "产品",
      security: "安全",
      pricing: "价格",
      docs: "文档",
    },
    github: "GitHub",
    signIn: "登录",
    start: `开始使用 ${CLOUD}`,
    menu: "打开菜单",
    close: "关闭菜单",
    theme: "深色模式",
    home: "Ocra 首页",
    primary: "主导航",
  },
};

interface NotFoundCopy {
  title: string;
  body: string;
  back: string;
  manual: string;
}

export const notFound: Bilingual<NotFoundCopy> = {
  en: {
    title: "Page not found",
    body: "The page you are looking for does not exist, or it moved.",
    back: "Back to the home page",
    manual: "Read the manual",
  },
  zh: {
    title: "页面不存在",
    body: "你要找的页面不存在，或者已经移动。",
    back: "返回首页",
    manual: "阅读手册",
  },
};
