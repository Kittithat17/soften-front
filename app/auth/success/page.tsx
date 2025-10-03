// app/auth/success/page.tsx
"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthSuccessInner() {
  const q = useSearchParams();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_BASE!;

  useEffect(() => {
    const token = q.get("token");
    if (!token) {
      router.replace("/Login?error=missing_token");
      return;
    }

    localStorage.setItem("access_token", token);

    (async () => {
      try {
        const me = await fetch(`${API}/api/userprofile`, {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json());
        const role = me?.user?.role ?? null;
        if (role) localStorage.setItem("role", role);
      } catch {}
      router.replace("/");
    })();
  }, [q, router, API]);

  return <p className="p-6">Signing you in…</p>;
}

export default function AuthSuccess() {
  return (
    <Suspense fallback={<p className="p-6">Signing you in…</p>}>
      <AuthSuccessInner />
    </Suspense>
  );
}

