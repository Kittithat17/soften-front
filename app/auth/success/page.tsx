// app/auth/success/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthSuccess() {
  const q = useSearchParams();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_BASE!;

  useEffect(() => {
    const token = q.get("token");
    if (!token) return router.replace("/Login?error=missing_token");

    localStorage.setItem("access_token", token);

    // (ถ้าต้องการ role) ดึงจาก /api/me
    (async () => {
      try {
        const me = await fetch(`${API}/api/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then(r => r.json());
        const role = me?.user?.role ?? null;
        if (role) localStorage.setItem("role", role);
      } catch {}
      router.replace("/");
    })();
  }, [q, router, API]);

  return <p className="p-6">Signing you in…</p>;
}
