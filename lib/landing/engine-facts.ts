// The engine's numbers and names that the copy states as facts. They live
// here once, and scripts/engine-facts.test.mjs compares them with the
// engine's source (CI checks the engine out next to this repository).

// How many steps a review agent may take before it is stopped:
// MAX_AGENT_STEPS in ocra's packages/core/src/runtime/attempt.ts.
export const MAX_AGENT_STEPS = 30;

// How many model providers ocra Cloud's gateway forwards to: the entries of
// PROVIDER_IDS in ocra's packages/cloud-contract/src/providers.ts.
export const PROVIDERS = 45;

// How many built-in tools the pinned OpenCode has, every one turned off for
// ocra's agents: the entries of OPENCODE_BUILTIN_TOOLS in ocra's
// packages/runtime-opencode/src/opencode-config.ts. The security band names
// four of them and counts the rest.
export const OPENCODE_BUILTINS = 14;
export const BUILTINS_OFF = ["bash", "edit", "write", "webfetch"] as const;

// Paths the gate refuses, as the security band names them: secret patterns
// (SECRET_PATTERNS in ocra's packages/core/src/select/patterns.ts, there as
// `**/<name>` or `**/<name>*`) and git's internals, which reviewContext
// refuses by path segment (packages/core/src/pipeline/context.ts).
export const REFUSED = [".env", "*.pem", "id_rsa", ".git/"] as const;

// What the gate answers an agent that asks for a refused path: the message
// of the AccessDeniedError reviewContext throws. Engine output, English in
// every language.
export const accessDenied = (path: string) => `Access to ${path} is not allowed`;
