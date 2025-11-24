"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  User as UserIcon,
  Award,
  Heart,
  Grid2X2,
  Badge as BadgeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HeroHeader2 } from "@/components/hero8-head2";
import { useAuth } from "@/app/context/AuthContext";
import type { UserProfile } from "@/types/profile";
import type { PostResponse } from "@/types/post";
import Link from "next/link";

interface FollowerCountResponse {
  user_id: number;
  follower_count: number;
}

interface FollowingCountResponse {
  user_id: number;
  following_count: number;
}

interface FollowerDetail {
  user_id: number;
  firstname?: string;
  lastname?: string;
  image_url?: string | null;
}

interface FollowerDetailResponse {
  followers: FollowerDetail[];
}

export default function ProfileOther() {
  const API = process.env.NEXT_PUBLIC_API_BASE!;
  const params = useParams();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") ?? "";
  const id = decodeURIComponent(params.id as string);

  const { token, loading: authLoading, user: authUser } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    if (authLoading) return;

    const viewedUserId = Number(id);
    if (Number.isNaN(viewedUserId)) {
      setErr("Invalid user id");
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setErr(null);
        setLoading(true);

        const headers: HeadersInit = token
          ? { Authorization: `Bearer ${token}` }
          : {};

        const [profileRes, postRes, followerRes, followingRes] =
          await Promise.all([
            fetch(`${API}/userprofile/${viewedUserId}`, { headers }),
            fetch(`${API}/getallpost/${username}`, { headers }),
            fetch(`${API}/getallfollower/${viewedUserId}`),
            fetch(`${API}/getallfollowing/${viewedUserId}`),
          ]);

        if (!profileRes.ok) throw new Error(await profileRes.text());
        if (!postRes.ok) throw new Error(await postRes.text());
        if (!followerRes.ok) throw new Error(await followerRes.text());
        if (!followingRes.ok) throw new Error(await followingRes.text());

        const profileData: UserProfile = await profileRes.json();
        const postData: { posts?: PostResponse[] } = await postRes.json();
        const followerData: FollowerCountResponse = await followerRes.json();
        const followingData: FollowingCountResponse =
          await followingRes.json();

        if (!cancelled) {
          setProfile(profileData);
          setPosts(postData.posts ?? []);
          setFollowerCount(followerData.follower_count ?? 0);
          setFollowingCount(followingData.following_count ?? 0);
        }

        // เช็คว่าเราฟอลเขาอยู่ไหม
        if (!cancelled && token && authUser) {
          const detailRes = await fetch(
            `${API}/api/getallfollowerdetail/${viewedUserId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (detailRes.ok) {
            const detailData: FollowerDetailResponse = await detailRes.json();
            const followers = detailData.followers ?? [];
            const iFollow = followers.some(
              (follower) => follower.user_id === authUser.id
            );

            if (!cancelled) {
              setIsFollowing(iFollow);
            }
          }
        }
      } catch (e) {
        if (!cancelled) {
          setErr(e instanceof Error ? e.message : "Fetch failed");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [API, token, authLoading, id, username, params.id, authUser]);

  const handleToggleFollow = async (): Promise<void> => {
    const viewedUserId = Number(id);
    if (Number.isNaN(viewedUserId)) return;

    if (!token) {
      window.location.href = "/Login";
      return;
    }

    if (followLoading) return;

    try {
      setFollowLoading(true);

      if (isFollowing) {
        // unfollow
        const res = await fetch(`${API}/api/unfollowuser/${viewedUserId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Unfollow failed:", await res.text());
          return;
        }

        setIsFollowing(false);
        setFollowerCount((prev) => (prev > 0 ? prev - 1 : 0));
      } else {
        // follow
        const form = new FormData();
        form.append("user_id", String(viewedUserId));

        const res = await fetch(`${API}/api/followuser`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: form,
        });

        if (!res.ok) {
          console.error("Follow failed:", await res.text());
          return;
        }

        setIsFollowing(true);
        setFollowerCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Toggle follow error:", error);
    } finally {
      setFollowLoading(false);
    }
  };

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
        <Card className="rounded-3xl border-none bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:bg-neutral-900">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            {/* Avatar + level */}
            <div className="flex flex-col items-center md:items-start">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-[#F8D838] ring-4 ring-white md:h-28 md:w-28">
                  {avatar && avatar !== "" && avatar !== "<nil>" ? (
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

                <div className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-white shadow">
                  🍳
                </div>
              </div>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700">
                <span className="inline-block h-2 w-24 overflow-hidden rounded-full bg-neutral-400/60">
                  <span className="block h-full w-[85%] bg-neutral-700" />
                </span>
                Level 10
              </div>
            </div>

            {/* Middle info block */}
            <div className="flex-1">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold md:text-2xl">
                    {fullName}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-neutral-600">
                    <span>
                      <b>{posts.length}</b> posts
                    </span>
                    <span>
                      <b>{followerCount}</b> followers
                    </span>
                    <span>
                      <b>{followingCount}</b> following
                    </span>
                  </div>
                </div>

                {/* action buttons align right on desktop */}
                <div className="mt-2 flex flex-col w-full gap-2 md:mt-0 md:w-auto">
                  {/* ปุ่ม Follow / Following (ไม่แสดงถ้าดูโปรไฟล์ตัวเอง) */}
                  {authUser && Number(id) !== authUser.id && (
                    <Button
                      onClick={handleToggleFollow}
                      disabled={followLoading}
                      className={`w-full rounded-2xl md:w-auto ${
                        isFollowing
                          ? "bg-neutral-800 text-white hover:bg-neutral-700"
                          : "bg-[#F8D838] text-black hover:bg-[#e7c92f]"
                      }`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    className="w-full gap-2 rounded-2xl md:w-auto"
                  >
                    <Award className="h-4 w-4" />
                    Badges(5)
                  </Button>
                </div>
              </div>

              <div className="mt-4 rounded-2xl bg-neutral-100 p-4 text-sm text-neutral-700">
                <p>{email}</p>
                <p className="mt-1">{phone}</p>
                <p className="mt-2">{about}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
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
                <span className="hidden sm:inline">Saved Posts</span>
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

            <TabsContent value="posts" className="p-6">
              {posts.length > 0 ? (
                <div className="grid grid-cols-3 gap-4 sm:gap-5">
                  {posts.map((post) => (
                    <Link
                      key={post.post.post_id}
                      href={`/Menu/${post.post.post_id}`}
                      className="block overflow-hidden rounded-2xl"
                    >
                      {post.post.image_url && post.post.image_url !== "" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.post.image_url}
                          alt={post.post.menu_name || "food"}
                          className="aspect-square w-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                      ) : (
                        <div className="aspect-square w-full bg-gray-200 flex items-center justify-center text-gray-400">
                          No Image
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-600">No posts yet.</p>
              )}
            </TabsContent>

            <TabsContent value="likes" className="p-6">
              <p className="text-sm text-neutral-600">
                Can&apos;t saved posts yet…
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
