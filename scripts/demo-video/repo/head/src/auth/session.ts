import { randomUUID } from "node:crypto";
import type { Store } from "../store.js";

// Sessions live in the shared store under "session:<id>".
export interface Session {
  id: string;
  userId: string;
  // Unix time in seconds, as the mobile clients expect.
  createdAt: number;
  expiresAt: number;
}

const TTL_SECONDS = 30 * 60;

export async function createSession(store: Store, userId: string): Promise<Session> {
  const now = Math.floor(Date.now() / 1000);
  const session: Session = {
    id: randomUUID(),
    userId,
    createdAt: now,
    expiresAt: now + TTL_SECONDS,
  };
  await store.set(`session:${session.id}`, session);
  return session;
}

export async function loadSession(store: Store, id: string): Promise<Session | undefined> {
  const session = await store.get<Session>(`session:${id}`);
  if (!session || isExpired(session)) {
    await store.delete(`session:${id}`);
    return undefined;
  }
  return session;
}

export async function endSession(store: Store, id: string): Promise<void> {
  await store.delete(`session:${id}`);
}

// A session ends TTL_SECONDS after it was created.
export function isExpired(session: Session): boolean {
  return session.expiresAt < Date.now();
}
