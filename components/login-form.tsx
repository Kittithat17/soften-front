'use client';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import GoogleLoginButton from "./GoogleLoginButton";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState(""); // หลังบ้านต้องการ key ชื่อ username (จะใส่อีเมลก็ได้)
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSubmitting(true);
    try {
      await login(username, password);
      router.replace("/"); // สำเร็จ → ไปหน้าแรก (หรือจะ route ตาม role ก็ได้)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 pt-20", className)} {...props}>
      <Card className="overflow-hidden p-0 ">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">
                  Welcome to <span className='text-teal-600'>Cook</span>
                  <span className="text-yellow-400">pedia</span>
                </h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Cookpedia account
                </p>
              </div>

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

              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder='Password'
                    required
                    className="pr-10"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-transparent text-sm text-muted-foreground  focus:outline-none "
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3l18 18" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.88 9.88A3 3 0 0114.12 14.12" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.46 12.34C3.73 8.9 7 6 12 6c1.1 0 2.16.18 3.14.5" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.84 15.66C19.57 19.1 16.3 22 12.3 22c-1.1 0-2.16-.18-3.14-.5" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.46 12.34C3.73 8.9 7 6 12 6s8.27 2.9 9.54 6.34a1 1 0 010 .32C20.27 15.1 17 18 12 18s-8.27-2.9-9.54-6.34a1 1 0 010-.32z" />
                        <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" disabled={submitting} className="w-full bg-yellow-400 font-bold text-lg dark:text-teal-600 hover:bg-yellow-300">
                {submitting ? "Logging in..." : "Login"}
              </Button>

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>

              <div className="grid gap-4">
                <GoogleLoginButton />
              </div>

              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="/Register" className="underline underline-offset-4 text-blue-500 hover:text-blue-300">
                  Register
                </a>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <Image
              src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Image"
              width={600}
              height={800}
              className="absolute inset-0 h-full w-full object-cover "
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
