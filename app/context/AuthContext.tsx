//app/context/AuthContext.tsx
"use client";
import { User, Role } from "@/types/user";
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";



type AuthState = {
  token: string | null;
  role: Role;
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (roles: Role[]) => boolean;
};

const AuthCtx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const API = process.env.NEXT_PUBLIC_API_BASE!;
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(undefined);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem("access_token");
    const r = localStorage.getItem("role") as Role | null;
    setToken(t);
    setRole(r ?? undefined);
  }, []);

  useEffect(() => {
    (async () => {
      if (!token) { setUser(null); setLoading(false); return; }
      try {
        const res = await fetch(`${API}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (res.ok) {
          const me = await res.json();
          const nextUser: User | null = me?.user ?? null;
          setUser(nextUser);
          const r = (nextUser?.role ?? localStorage.getItem("role")) as Role;
          if (r) setRole(r);
        } else if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("role");
          setToken(null);
          setRole(undefined);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [token, API]);

  // ✅ ทำฟังก์ชันให้มี stable reference
  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => "Login failed");
      throw new Error(msg);
    }
    const data = await res.json();
    const tok: string | undefined = data?.token;
    const r: Role = data?.role ?? data?.user?.role ?? "";
    if (!tok) throw new Error("Missing token in response");

    localStorage.setItem("access_token", tok);
    if (r !== undefined) localStorage.setItem("role", String(r));

    setToken(tok);
    setRole(r);
    setUser(data?.user ?? null);
  }, [API]);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(undefined);
    setUser(null);
  }, []);

  const hasRole = useCallback((roles: Role[]) => {
    if (!role) return false;
    return roles.includes(role);
  }, [role]);

  // ✅ ใส่ dependencies ให้ครบ รวมฟังก์ชันที่เป็น useCallback
  const value = useMemo(
    () => ({ token, role, user, loading, login, logout, hasRole }),
    [token, role, user, loading, login, logout, hasRole]
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
