import { PROVIDERS } from "@/lib/landing/engine-facts";
import type { Bilingual } from "../define";

// The providers wall: the headline wraps around Ocra's own mark.
interface ProvidersCopy {
  before: string;
  after: string;
  body: string;
  label: string;
}

export const providers: Bilingual<ProvidersCopy> = {
  en: {
    before: "Ocra",
    after: `runs on the model you already pay for, across ${PROVIDERS} providers`,
    body: "Bring a key from OpenAI, Anthropic, Gemini, DeepSeek, Qwen and the rest, or point Ocra at your company's own endpoint. Keys are encrypted and never shown again.",
    label: "Some of the providers Ocra Cloud forwards to",
  },
  zh: {
    before: "Ocra",
    after: `跑在你已经在付费的模型上，${PROVIDERS} 家服务商任选`,
    body: "带上 OpenAI、Anthropic、Gemini、DeepSeek、通义千问等任一家的 key，或者让 Ocra 指向公司自己的端点。key 加密保存，之后不再显示。",
    label: "Ocra Cloud 可以转发到的部分服务商",
  },
};
