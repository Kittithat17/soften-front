//types/user.ts
export type User = {
  id: number;
  username: string;
  email?: string;
  role?: Role;
  profile?: string;
};

export type Role = "admin" | "user" 