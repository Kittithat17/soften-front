// app/admin/page.tsx

import LogoutButton from "@/components/LogoutButton";
import RequireAuth from "@/components/RequireAuth";

export default function AdminPage() {
  return (
    <RequireAuth roles={["admin"]}>
      <main className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Admin Only</h1>
        <LogoutButton />
        {/* admin content */}
      </main>
    </RequireAuth>
  );
}
