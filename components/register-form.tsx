//register-form.tsx
"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_BASE!;
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(null);
    setSubmitting(true);
  
    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          password,
        }),
      });
  
      if (!res.ok) {
        let message = "Register failed";
  
        try {
          const ct = res.headers.get("content-type") || "";
          if (ct.includes("application/json")) {
            const j = await res.json();
  
            // ดึงข้อความจาก key ต่าง ๆ ที่ backend ส่งมา
            message =
              j.message ||
              j.Username ||
              j.username ||
              j.Email ||
              j.email ||
              j.Password ||
              j.password ||
              message;
          } else {
            message = await res.text();
          }
        } catch {
          // ถ้า parse json พัง ก็ใช้ message เดิมไป
        }
  
        throw new Error(message);
      }
  
      // ถ้า ok
      setOk("Registered! Please login.");
      setTimeout(() => router.replace("/Login"), 800);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Register failed";
  
      setError(message); // ⭐ ตรงนี้จะโชว์ข้อความจาก backend เลย เช่น "Password must contain at least 1 special character"
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className={cn("flex flex-col gap-6 pt-20", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">
                  Welcome to <span className="text-teal-600">Cook</span>
                  <span className="text-yellow-400">pedia</span>
                </h1>
                <p className="text-muted-foreground text-balance">
                  Fill in your information to get started
                </p>
              </div>

              {/* username */}
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  required
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>

              {/* email */}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              {/* password with show/hide */}
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>

                {/* wrapper relative เพื่อวางปุ่ม eye */}
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    className="pr-10"
                    value={password}
                    onChange={e => setPassword(e.target.value)} // ให้พื้นที่ปุ่มขวา
                  />

                  {/* ปุ่ม show/hide (type=button เพื่อไม่ให้ submit form) */}
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-transparent text-sm text-muted-foreground  focus:outline-none "
                  >
                    {showPassword ? (
                      // eye-off icon (SVG)
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M3 3l18 18"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M9.88 9.88A3 3 0 0114.12 14.12"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M2.46 12.34C3.73 8.9 7 6 12 6c1.1 0 2.16.18 3.14.5"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M20.84 15.66C19.57 19.1 16.3 22 12.3 22c-1.1 0-2.16-.18-3.14-.5"
                        />
                      </svg>
                    ) : (
                      // eye icon (SVG)
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M2.46 12.34C3.73 8.9 7 6 12 6s8.27 2.9 9.54 6.34a1 1 0 010 .32C20.27 15.1 17 18 12 18s-8.27-2.9-9.54-6.34a1 1 0 010-.32z"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {ok && <p className="text-sm text-green-600">{ok}</p>}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-yellow-400 font-bold text-lg dark:text-teal-600 hover:bg-yellow-300"
              >
                {submitting ? "Registering..." : "Register"}
              </Button>


              <div className="text-center text-sm">
                Already have an account?{" "}
                <a
                  href="/Login"
                  className="underline underline-offset-4 text-blue-500 hover:text-blue-300"
                >
                  Login
                </a>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <Image
              src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?q=80&w=820&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Image"
              width={600}
              height={800}
              className="absolute inset-0 h-full w-full object-cover"
              priority
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
