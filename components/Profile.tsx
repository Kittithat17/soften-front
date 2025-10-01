"use client";

import { useEffect, useState } from "react";
import {
  User as UserIcon,
  Award,
  Pencil,
  Heart,
  Grid2X2,
  Badge as BadgeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HeroHeader2 } from "./hero8-head2";
import { useAuth } from "@/app/context/AuthContext";
import type { UserProfile } from "@/types/profile";
import Link from "next/link";

export default function Profile() {
  const API = process.env.NEXT_PUBLIC_API_BASE!;
  const { token, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      setLoading(false);
      return;
    }
    let cancelled = false;

    (async () => {
      try {
        setErr(null);
        const res = await fetch(`${API}/api/userprofile`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok) throw new Error(await res.text());
        const data: UserProfile = await res.json();
        if (!cancelled) setProfile(data);
      } catch (e) {
        if (!cancelled)
          setErr(e instanceof Error ? e.message : "Fetch profile failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [API, token, authLoading]);

  const posts = [
    {
      id: 1,
      img: "https://plus.unsplash.com/premium_photo-1675252369719-dd52bc69c3df?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      img: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      img: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=1049&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  if (loading)
    return (
      <>
        <HeroHeader2 />
       
      </>
    );
  if (err)
    return (
      <>
        <HeroHeader2 />
        <div className="mx-auto max-w-6xl pt-24 p-6 text-red-600">{err}</div>
      </>
    );

  const fullName =
    [profile?.firstname, profile?.lastname].filter(Boolean).join(" ") || "—";
  const email = profile?.email || "—";
  const phone = profile?.phone || "—";
  const about = profile?.aboutme || "—";
  const avatar = profile?.image_url;

  return (
    <>
      <HeroHeader2 />
      <div className="mx-auto w-full max-w-6xl px-4 pt-24 pb-10">
        {/* ===== Profile Header Card (Desktop look) / Stacked (Mobile) ===== */}
        <Card className="rounded-3xl border-none bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:bg-neutral-900">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {/* Avatar + level */}
            <div className="flex flex-col items-center md:items-start">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#F8D838] ring-4 ring-white md:h-28 md:w-28">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatar}
                      alt="avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-14 w-14 text-black/80" />
                  )}
                </div>

                {/* chef small badge on avatar */}
                <div className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-white shadow">
                  🍳
                </div>
              </div>

              {/* level pill */}
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700">
                <span className="inline-block h-2 w-24 overflow-hidden rounded-full bg-neutral-400/60">
                  <span className="block h-full w-[85%] bg-neutral-700" />
                </span>
                Level 10
              </div>
            </div>

            {/* Middle info block */}
            <div className="flex-1">
              {/* name + quick stats row (PC) */}
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold md:text-2xl">
                    {fullName}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-neutral-600">
                    <span>
                      <b>10</b> posts
                    </span>
                    <span>
                      <b>200</b> followers
                    </span>
                    <span>
                      <b>400</b> following
                    </span>
                  </div>
                </div>

                {/* action buttons align right on desktop */}
                <div className="mt-2 flex flex-col w-full gap-2 md:mt-0 md:w-auto">
                  <Button className="w-full gap-2 rounded-2xl bg-[#F8D838] text-black hover:bg-[#e7c92f] md:w-auto">
                    <Link href="/profile/edit" className="flex gap-2">
                      <Pencil className="h-4 w-4" />
                      Edit Profile
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2 rounded-2xl md:w-auto"
                  >
                    <Award className="h-4 w-4" />
                    Badges(5)
                  </Button>
                </div>
              </div>

              {/* contact + bio bubble (Mobile style) */}
              <div className="mt-4 rounded-2xl bg-neutral-100 p-4 text-sm text-neutral-700">
                <p>{email}</p>
                <p className="mt-1">{phone}</p>
                <p className="mt-2">{about}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* ===== Tabs ===== */}
        <Card className="mt-6 overflow-hidden rounded-3xl border-none shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList
              className="
                grid w-full grid-cols-3 rounded-none mt-[-24] sm:mt-[-24] sm:pb-9.5 
                bg-neutral-300/70 
                *:rounded-none
              "
            >
              <TabsTrigger
                value="posts"
                className="data-[state=active]:bg-neutral-700  data-[state=active]:text-white py-3 ml-[-3] mt-[-5] "
                aria-label="Posts"
              >
                <Grid2X2 className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Posts</span>
              </TabsTrigger>
              <TabsTrigger
                value="likes"
                className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white  py-3 ml-[-3] mt-[-5]"
                aria-label="Likes"
              >
                <Heart className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Likes</span>
              </TabsTrigger>
              <TabsTrigger
                value="badges"
                className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white py-3 mr-[-3] mt-[-5]"
                aria-label="Badges"
              >
                <BadgeIcon className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Badges</span>
              </TabsTrigger>
            </TabsList>

            {/* Posts grid – PC 3 col, Mobile 3 little squares like mock */}
            <TabsContent value="posts" className="p-5">
              <div className="grid grid-cols-3 gap-4 sm:gap-5">
                {posts.map((p) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={p.id}
                    src={p.img}
                    alt="food"
                    className="aspect-square w-full rounded-2xl object-cover"
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="likes" className="p-6">
              <p className="text-sm text-neutral-600">
                You have no liked posts yet.
              </p>
            </TabsContent>

            <TabsContent value="badges" className="p-6">
              <p className="text-sm text-neutral-600">
                🏆 Badge list coming soon…
              </p>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </>
  );
}
