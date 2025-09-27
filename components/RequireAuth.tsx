//requireAuth.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";


export default function RequireAuth({
  children,
  roles, // เช่น ["admin"] หรือ ["admin","user"]
}: {
  children: React.ReactNode;
  roles?: ("admin" | "user")[];
}) {
  const { token, loading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!token) {
      router.replace("/Login?error=unauthorized");
      return;
    }
    if (roles && roles.length > 0 && !hasRole(roles)) {
      router.replace("/?error=forbidden");
      return;
    }
  }, [token, loading, roles, hasRole, router]);

  if (loading) return <p className="p-6">Loading…</p>;
  return <>{children}</>;
}
