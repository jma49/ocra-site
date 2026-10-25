// The engine's numbers and names that the copy states as facts. They live
// here once. scripts/engine-facts.test.mjs compares them with the engine's
// source where the engine is checked out next to this repository (../ocra,
// or OCRA_DIR), and skips elsewhere, CI included.

// How many steps a review agent may take before it is stopped:
// MAX_AGENT_STEPS in ocra's packages/core/src/runtime/attempt.ts.
export const MAX_AGENT_STEPS = 30;

// The model providers ocra Cloud's gateway forwards to, in its order:
// PROVIDER_IDS in ocra's packages/cloud-contract/src/providers.ts. The
// works band prints them as an index, and the copy states their count.
export const PROVIDER_IDS = [
  "openai",
  "anthropic",
  "openrouter",
  "gemini",
  "deepseek",
  "mistral",
  "groq",
  "xai",
  "together",
  "fireworks",
  "cerebras",
  "moonshot",
  "moonshot-cn",
  "kimi-coding",
  "zai",
  "zhipu",
  "qwen",
  "qwen-cn",
  "minimax",
  "minimax-cn",
  "siliconflow",
  "siliconflow-cn",
  "volcengine",
  "qianfan",
  "hunyuan",
  "stepfun",
  "baichuan",
  "longcat",
  "huggingface",
  "cohere",
  "vercel",
  "deepinfra",
  "perplexity",
  "venice",
  "novita",
  "nebius",
  "sambanova",
  "inference-net",
  "chutes",
  "upstage",
  "ai21",
  "ionos",
  "scaleway",
  "featherless",
  "opencode-zen",
] as const;
export const PROVIDERS = PROVIDER_IDS.length;

// How many built-in tools the pinned OpenCode has, every one turned off for
// ocra's agents: the entries of OPENCODE_BUILTIN_TOOLS in ocra's
// packages/runtime-opencode/src/opencode-config.ts. The security band names
// four of them and counts the rest.
export const OPENCODE_BUILTINS = 14;
export const BUILTINS_OFF = ["bash", "edit", "write", "webfetch"] as const;

// Paths the gate refuses, as the security band prints them, each with the
// rule that refuses it: a secret pattern (SECRET_PATTERNS in ocra's
// packages/core/src/select/patterns.ts, verbatim) or git's internals, which
// reviewContext refuses by path segment (packages/core/src/pipeline/context.ts).
export const REFUSED_RULES = [
  { path: ".env", rule: "**/.env", kind: "secret" },
  { path: "*.pem", rule: "**/*.pem", kind: "secret" },
  { path: "id_rsa", rule: "**/id_rsa*", kind: "secret" },
  { path: ".git/", rule: ".git", kind: "git" },
] as const;
export const REFUSED = REFUSED_RULES.map((r) => r.path);

// More names the secret patterns refuse, as the band lists them: each is in
// SECRET_PATTERNS as `**/<name>` or `**/<name>*`.
export const ALSO_REFUSED = [
  ".npmrc",
  ".netrc",
  "*.key",
  "id_ed25519",
  ".aws/credentials",
  ".kube/config",
  "*.tfstate",
  "credentials.json",
] as const;

// Where each of the band's four security properties is enforced, in the
// engine's repository, in the order of the copy's `props`.
export const CLAUSE_SOURCES = [
  "packages/core/src/review/prompt-text.ts",
  "docs/adr/0013-fork-pull-requests.md",
  "packages/core/src/select/patterns.ts",
  "packages/vcs-local/src/git.ts",
] as const;

// What the gate answers an agent that asks for a refused path: the message
// of the AccessDeniedError reviewContext throws. Engine output, English in
// every language.
export const accessDenied = (path: string) => `Access to ${path} is not allowed`;
