//logout button component
"use client";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  const onClick = () => {
    logout();
    router.replace("/Login");
  };
  return (
    <Button onClick={onClick} className="hover:bg-red-400">
      Logout
    </Button>
  );
}
