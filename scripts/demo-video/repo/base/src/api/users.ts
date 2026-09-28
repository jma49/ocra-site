export interface User {
  id: string;
  email: string;
}

// Requests reach login() only after validateLogin() found the user.
export const users = {
  async findByEmail(email: string): Promise<User | undefined> {
    return email.endsWith("@acme.dev") ? { id: `u_${email}`, email } : undefined;
  },
};
