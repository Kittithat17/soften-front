//types/user.ts
export type User = {
  id: number;
  username: string;
  email?: string;
  role?: Role;
  profile?: string;
  image_url?: string;  // ✅ Add this
  profile_img?: string; // ✅ Add this
};

export type Role = "admin" | "user" 