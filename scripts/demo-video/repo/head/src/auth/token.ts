import { randomBytes } from "node:crypto";
import type { Store } from "../store.js";
import { endSession } from "./session.js";

export interface RefreshToken {
  value: string;
  sessionId: string;
}

export async function issueToken(store: Store, sessionId: string): Promise<RefreshToken> {
  const token = { value: randomBytes(32).toString("base64url"), sessionId };
  await store.set(`token:${token.value}`, token);
  return token;
}

// Logging out ends the session and revokes its refresh token.
export async function logout(store: Store, token: RefreshToken): Promise<void> {
  await endSession(store, token.sessionId);
  await store.delete(`token:${token.value}`);
}
