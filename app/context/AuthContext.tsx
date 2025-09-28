// app/context/AuthContext.tsx
"use client";
import { User, Role } from "@/types/user";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

const isRole = (x: unknown): x is Role => x === "admin" || x === "user";

type AuthState = {
  token: string | null;
  role: Role | null;
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
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // hydrate จาก localStorage ครั้งแรก
  useEffect(() => {
    const t = localStorage.getItem("access_token");
    const raw = localStorage.getItem("role"); // string | null
    setToken(t);
    setRole(isRole(raw) ? raw : null);
  }, []);

  // sync ข้ามแท็บ 
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "access_token" || e.key === "role") {
        const t = localStorage.getItem("access_token");
        const raw = localStorage.getItem("role");
        setToken(t);
        setRole(isRole(raw) ? raw : null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // confirm กับเซิร์ฟเวอร์
  useEffect(() => {
    (async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(`${API}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (res.ok) {
          const me = await res.json();
          const nextUser: User | null = me?.user ?? null;
          setUser(nextUser);

          const raw = nextUser?.role ?? localStorage.getItem("role");
          if (isRole(raw)) {
            setRole(raw);
            localStorage.setItem("role", raw);
          } else {
            setRole(null);
            localStorage.removeItem("role");
          }
        } else if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("role");
          setToken(null);
          setRole(null);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [token, API]);

  const login = useCallback(
    async (username: string, password: string) => {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const msg = await res.text().catch(() => "Login failed");
        throw new Error(msg || `Login failed (${res.status})`);
      }
      const data = await res.json();
      const tok: string | undefined = data?.token;
      const rawRole = data?.role ?? data?.user?.role; // unknown

      if (!tok) throw new Error("Missing token in response");

      localStorage.setItem("access_token", tok);
      setToken(tok);

      if (isRole(rawRole)) {
        localStorage.setItem("role", rawRole);
        setRole(rawRole);
      } else {
        localStorage.removeItem("role");
        setRole(null);
      }

      setUser((data?.user ?? null) as User | null);
    },
    [API]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (roles: Role[]) => {
      return role ? roles.includes(role) : false;
    },
    [role]
  );

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
