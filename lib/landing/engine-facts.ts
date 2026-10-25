// The engine's numbers that the copy states as facts. They live here once,
// and scripts/engine-facts.test.mjs compares them with the engine's source
// whenever ../ocra is checked out next to this repository.

// How many steps a review agent may take before it is stopped:
// MAX_AGENT_STEPS in ocra's packages/core/src/runtime/attempt.ts.
export const MAX_AGENT_STEPS = 30;

// How many model providers ocra Cloud's gateway forwards to: the entries of
// PROVIDER_IDS in ocra's packages/cloud-contract/src/providers.ts.
export const PROVIDERS = 45;
