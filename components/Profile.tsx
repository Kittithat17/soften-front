"use client";

import { useEffect, useState } from "react";
import { User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HeroHeader2 } from "./hero8-head2";
import { useAuth } from "@/app/context/AuthContext";
import type { UserProfile } from "@/types/profile";

export default function Profile() {
  const API = process.env.NEXT_PUBLIC_API_BASE!;
  const { token } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!token) { setLoading(false); return; }
      try {
        setErr(null);
        const res = await fetch(`${API}/api/userprofile`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });
        if (!res.ok) {
          const msg = await res.text().catch(() => `Fetch profile failed (${res.status})`);
          throw new Error(msg || `Fetch profile failed (${res.status})`);
        }
        const data: UserProfile = await res.json();
        if (!cancelled) setProfile(data);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Fetch profile failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [API, token]);

  const posts = [
    { id: 1, img: "https://i.ibb.co/3hJxXmF/omelet.jpg" },
    { id: 2, img: "https://i.ibb.co/syjGV2j/tomyum.jpg" },
    { id: 3, img: "https://i.ibb.co/hf4LVxW/curry.jpg" },
  ];

  // UI states
  if (loading) return (<><HeroHeader2 /><div className="max-w-3xl mx-auto pt-24 p-6">Loading profile…</div></>);
  if (err) return (<><HeroHeader2 /><div className="max-w-3xl mx-auto pt-24 p-6 text-red-600">{err}</div></>);

  // fallback เวลา field ว่างจาก backend
  const fullName = [profile?.firstname, profile?.lastname].filter(Boolean).join(" ") || "—";
  const email = profile?.email || "—";
  const phone = profile?.phone || "—";
  const about = profile?.aboutme || "—";
  const avatar = profile?.image_url;

  return (
    <>
      <HeroHeader2 />
      <div className="max-w-3xl mx-auto py-6 px-4 space-y-6 pt-20">
        {/* Profile Card */}
        <Card className="p-4 rounded-2xl shadow-md flex flex-col md:flex-row gap-6 items-center">
          {/* Avatar + Level */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-yellow-300 overflow-hidden flex items-center justify-center">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-10 h-10 text-black" />
              )}
            </div>
            <div className="mt-2 text-xs bg-gray-200 rounded-full px-3 py-1">
              Level 10
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-1 text-center md:text-left">
            <h2 className="text-lg font-semibold">{fullName}</h2>
            <p className="text-sm text-gray-600">
              Total Post : <b>10</b> posts
            </p>
            <p className="text-sm text-gray-600">{email}</p>
            <p className="text-sm text-gray-600">{phone}</p>
            <p className="text-sm">{about}</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
              Edit Profile
            </Button>
            <Button variant="outline">🏆 Badges (5)</Button>
          </div>
        </Card>

        {/* Tabs + Content */}
        <Card className="overflow-hidden rounded-2xl">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid grid-cols-3 w-full bg-gray-200 rounded-t-xl">
              <TabsTrigger value="posts">📋</TabsTrigger>
              <TabsTrigger value="likes">❤️</TabsTrigger>
              <TabsTrigger value="badges">🏅</TabsTrigger>
            </TabsList>

            <TabsContent value="posts">
              <div className="grid grid-cols-3 gap-2 p-4">
                {posts.map((p) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={p.id} src={p.img} alt="food" className="w-full rounded-lg object-cover" />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="likes">
              <p className="p-4 text-sm text-gray-600">You have no liked posts yet.</p>
            </TabsContent>

            <TabsContent value="badges">
              <p className="p-4 text-sm text-gray-600">🏆 Badge list coming soon...</p>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </>
  );
}
