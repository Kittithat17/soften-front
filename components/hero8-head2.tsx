"use client";
import Link from "next/link";
import { Logo } from "./logo";
import { Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { ModeToggle } from "./mode-toggle";
import { useAuth } from "@/app/context/AuthContext";
import LogoutButton from "./LogoutButton";

const menuItems = [{ name: "About", href: "/about" }];

export const HeroHeader2 = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false); // เฉพาะ UI มือถือ
  const { user, token } = useAuth();

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className="bg-background/50 fixed z-20 w-full border-b backdrop-blur-3xl"
      >
        <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
          <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <Link
                href="/Menu"
                aria-label="home"
                className="flex items-center space-x-2 font-black text-xl text-teal-600"
              >
                <Logo />
                Cook<span className="text-yellow-400">pedia</span>
              </Link>

              {/* (มือถือ) */}
              <div className="flex items-center gap-2 lg:hidden">
                {/* ปุ่มเปิด/ปิดแถบค้นหา (UI อย่างเดียว) */}
                <button
                  type="button"
                  aria-label={showSearch ? "Close search" : "Open search"}
                  onClick={() => setShowSearch((v) => !v)}
                  className="p-2 rounded-full hover:bg-muted/60 transition"
                >
                  <Search className="size-6" />
                </button>

                {/* ปุ่มเมนู */}
                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState ? "Close Menu" : "Open Menu"}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                  <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                </button>
              </div>

              {/* เมนูบนเดสก์ท็อป  */}
              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ขวา (เดสก์ท็อป) */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Search (Desktop UI) */}
              <div className="group relative w-[360px] max-w-md">
                <input
                  type="text"
                  placeholder="Search recipes..."
                  className="w-full rounded-full border bg-muted/40 pl-11 pr-12 py-1.5 outline-none ring-0 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-teal-500 transition placeholder:text-muted-foreground"
                />
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-70"
                  size={18}
                />
              </div>
            </div>

            {/* กล่องเมนูแบบ overlay (โค้ดเดิม) */}
            <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground hover:text-accent-foreground block duration-150"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                {token && user ? (
                  <>
                    <Button asChild variant="outline">
                      <Link href="/profile">
                        <span>Profile</span>
                      </Link>
                    </Button>
                    <LogoutButton />
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/Login">
                        <span>Login</span>
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="/Register">
                        <span>Sign Up</span>
                      </Link>
                    </Button>
                  </>
                )}
                <ModeToggle />
              </div>
            </div>
          </div>

          {/* Search (Mobile UI)*/}
          <div className="lg:hidden py-2">
            <div
              className={[
                "relative overflow-hidden transition-all duration-300",
                showSearch ? "max-h-16 opacity-100" : "max-h-0 opacity-0",
              ].join(" ")}
            >
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  className="block w-full rounded-full border border-gray-300 bg-gray-50 pl-10 pr-12 py-2.5 leading-5 placeholder-gray-500 focus:outline-none"
                  placeholder="Search recipes..."
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
