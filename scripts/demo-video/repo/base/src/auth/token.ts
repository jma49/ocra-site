import { randomBytes } from "node:crypto";
import type { Store } from "../store.js";

export interface RefreshToken {
  value: string;
  sessionId: string;
}

export async function issueToken(store: Store, sessionId: string): Promise<RefreshToken> {
  const token = { value: randomBytes(32).toString("base64url"), sessionId };
  await store.set(`token:${token.value}`, token);
  return token;
}
