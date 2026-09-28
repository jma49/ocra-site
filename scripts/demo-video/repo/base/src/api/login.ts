import type { Store } from "../store.js";
import { createSession } from "../auth/session.js";
import { issueToken } from "../auth/token.js";
import { users } from "./users.js";

export async function login(store: Store, email: string) {
  const user = await users.findByEmail(email);
  const session = await createSession(store, user!.id);
  const token = await issueToken(store, session.id);
  return { session: session.id, token: token.value };
}
