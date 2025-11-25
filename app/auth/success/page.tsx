// app/auth/success/page.tsx
"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

function AuthSuccessInner() {
  const q = useSearchParams();
  const API = process.env.NEXT_PUBLIC_API_BASE!;

  useEffect(() => {
    const token = q.get("token");
    if (!token) {
      window.location.replace("/Login?error=missing_token");
      return;
    }
    localStorage.setItem("access_token", token);

    (async () => {
      let role: string | null = null;
      try {
        const me = await fetch(`${API}/api/userprofile`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }).then(r => r.json());
        role = me?.user?.role ?? me?.role ?? null;
      } catch {}

      // fallback จาก query (BE ส่ง ?Role=... มา)
      if (!role) {
        const roleFromQuery = q.get("Role");
        if (roleFromQuery === "admin" || roleFromQuery === "user") {
          role = roleFromQuery;
        }
      }
      if (role) localStorage.setItem("role", role);

      // รีโหลดทั้งหน้าให้ AuthContext hydrate แน่ ๆ
      window.location.replace("/Menu");
    })();
  }, [q, API]);

  return <p className="p-6">Signing you in…</p>;
}

export default function AuthSuccess() {
  return (
    <Suspense fallback={<p className="p-6">Signing you in…</p>}>
      <AuthSuccessInner />
    </Suspense>
  );
}
