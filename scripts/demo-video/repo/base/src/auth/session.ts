import { randomUUID } from "node:crypto";
import type { Store } from "../store.js";

// Sessions live in the shared store under "session:<id>".
export interface Session {
  id: string;
  userId: string;
  createdAt: number;
}

export async function createSession(store: Store, userId: string): Promise<Session> {
  const session: Session = {
    id: randomUUID(),
    userId,
    createdAt: Math.floor(Date.now() / 1000),
  };
  await store.set(`session:${session.id}`, session);
  return session;
}

export async function loadSession(store: Store, id: string): Promise<Session | undefined> {
  return store.get<Session>(`session:${id}`);
}

export async function endSession(store: Store, id: string): Promise<void> {
  await store.delete(`session:${id}`);
}
