//Google OAuth login button component
"use client";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

export default function GoogleLoginButton() {
    const API = process.env.NEXT_PUBLIC_API_BASE!;
    const startGoogleLogin = async () => {
      const res = await fetch(`${API}/auth/google`, { cache: "no-store" });
      if (!res.ok) return alert("Start Google OAuth failed");
      const { auth_url } = await res.json();
      window.location.href = auth_url;
    };
  return (
    <Button variant="outline" type="button" className="w-full cursor-pointer"  onClick={startGoogleLogin}>
      <FcGoogle  />
      Continue with Google
    </Button>
  );
}
