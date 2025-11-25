"use client";

import { useEffect, useState } from "react";
import {
  User as UserIcon,
  Award,
  Pencil,
  Heart,
  Grid2X2,
  Badge as BadgeIcon,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HeroHeader2 } from "./hero8-head2";
import { useAuth } from "@/app/context/AuthContext";
import type { UserProfile } from "@/types/profile";
import type { PostResponse } from "@/types/post";
import Link from "next/link";
import { ALL_BADGES, getBadgeMeta, type BadgeMeta } from "@/types/badge";

interface SavedPost {
  owner_post: {
    user_id: number;
    username: string;
    profile_image: string;
    created_date: string;
    created_time: string;
  };
  post: {
    post_id: number;
    image_url: string;
  };
}

interface FollowerCountResponse {
  user_id: number;
  follower_count: number;
}

interface FollowingCountResponse {
  user_id: number;
  following_count: number;
}

interface UserBadge {
  badge_id: number;
  name: string;
}

interface GetAllBadgesResponse {
  user_id: number;
  badges: UserBadge[];
}

export default function Profile() {
  const API = process.env.NEXT_PUBLIC_API_BASE!;
  const { token, loading: authLoading } = useAuth();

  const [unlockedBadgeIds, setUnlockedBadgeIds] = useState<number[]>([]);
  const [badgeErr, setBadgeErr] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [savedPosts, setSavedPost] = useState<SavedPost[]>([]);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);

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

        // 1) ดึง profile + saved posts + my posts
        const [profileRes, savedPostRes, postRes] = await Promise.all([
          fetch(`${API}/api/userprofile`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          fetch(`${API}/api/getallfavoritepost`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          fetch(`${API}/api/mypost`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
        ]);

        if (!profileRes.ok) throw new Error(await profileRes.text());
        if (!savedPostRes.ok) throw new Error(await savedPostRes.text());
        if (!postRes.ok) throw new Error(await postRes.text());

        const profileData: UserProfile = await profileRes.json();
        const savedPostData: { posts?: SavedPost[] } =
          await savedPostRes.json();
        const postData: { posts?: PostResponse[] } = await postRes.json();

        // 2) ดึง follower / following count จาก user_id ที่ได้จาก profile
        let followerCountValue = 0;
        let followingCountValue = 0;

        if (typeof profileData.user_id === "number") {
          const userId = profileData.user_id;

          const [followerRes, followingRes, badgesRes] = await Promise.all([
            fetch(`${API}/getallfollower/${userId}`),
            fetch(`${API}/getallfollowing/${userId}`),
            fetch(`${API}/getallbadges/${userId}`),
          ]);

          if (followerRes.ok) {
            const followerJson: FollowerCountResponse =
              await followerRes.json();
            followerCountValue = followerJson.follower_count ?? 0;
          }

          if (followingRes.ok) {
            const followingJson: FollowingCountResponse =
              await followingRes.json();
            followingCountValue = followingJson.following_count ?? 0;
          }

          if (badgesRes.ok) {
            const badgesJson: GetAllBadgesResponse = await badgesRes.json();
            const ids = badgesJson.badges.map((b) => b.badge_id);
            setUnlockedBadgeIds(ids);
          } else {
            setBadgeErr(await badgesRes.text());
          }
        }

        if (!cancelled) {
          setProfile(profileData);
          setSavedPost(savedPostData.posts ?? []);
          setPosts(postData.posts ?? []);
          setFollowerCount(followerCountValue);
          setFollowingCount(followingCountValue);
        }
      } catch (e) {
        if (!cancelled) {
          setErr(e instanceof Error ? e.message : "Fetch failed");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [API, token, authLoading]);

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
  const currentBadge = getBadgeMeta(profile?.badge_id ?? null);

  return (
    <>
      <HeroHeader2 />
      <div className="mx-auto w-full max-w-6xl px-4 pt-24 pb-10">
        <Card className="rounded-3xl border-none bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:bg-neutral-900">
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
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
                <div className="absolute -left-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-200 text-white shadow">
                  {currentBadge ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentBadge.image}
                      alt={currentBadge.label}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-lg">?</span>
                  )}
                </div>
              </div>
            </div>

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

                <div className="mt-2 flex flex-col w-full gap-2 md:mt-0 md:w-auto">
                  <Button className="w-full gap-2 rounded-2xl bg-[#F8D838] text-black hover:bg-[#e7c92f] md:w-auto">
                    <Link href="/profile/edit" className="flex gap-2">
                      <Pencil className="h-4 w-4" />
                      Edit Profile
                    </Link>
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

        <Card className="mt-6 overflow-hidden rounded-3xl border-none shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full grid-cols-3 rounded-none mt-[-24] sm:mt-[-24] sm:pb-9.5 bg-neutral-300/70 *:rounded-none">
              <TabsTrigger
                value="posts"
                className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white py-3 ml-[-3] mt-[-5]"
              >
                <Grid2X2 className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Posts</span>
              </TabsTrigger>
              <TabsTrigger
                value="likes"
                className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white py-3 ml-[-3] mt-[-5]"
              >
                <Heart className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Saved Posts</span>
              </TabsTrigger>
              <TabsTrigger
                value="badges"
                className="data-[state=active]:bg-neutral-700 data-[state=active]:text-white py-3 mr-[-3] mt-[-5]"
              >
                <BadgeIcon className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Badges</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="p-6">
              {posts.length > 0 ? (
                <div className="grid grid-cols-3 gap-4 sm:gap-5">
                  {posts.map((post, index) => (
                    <Link
                      key={post.post.post_id}
                      href={`/Menu/${post.post.post_id}`}
                    >
                      <img
                        src={post.post.image_url}
                        alt={`post-${index}`}
                        className="aspect-square w-full rounded-2xl object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/400?text=Error";
                        }}
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-600">
                  You have not posted anything yet.
                </p>
              )}
            </TabsContent>

            <TabsContent value="likes" className="p-6">
              {savedPosts.length > 0 ? (
                <div className="grid grid-cols-3 gap-4 sm:gap-5">
                  {savedPosts.map((item) => (
                    <Link
                      href={`/Menu/${item.post.post_id}`}
                      key={item.post.post_id}
                    >
                      <img
                        src={item.post.image_url}
                        alt="savedpost"
                        className="aspect-square w-full rounded-2xl object-cover"
                      />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-neutral-600">
                  You have no liked posts yet.
                </p>
              )}
            </TabsContent>

            <TabsContent value="badges" className="p-6">
  {badgeErr && (
    <p className="mb-2 text-sm text-red-500">
      Failed to load badges: {badgeErr}
    </p>
  )}

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {ALL_BADGES.map((badge: BadgeMeta) => {
      const isUnlocked = unlockedBadgeIds.includes(badge.id);
      const isEquipped = profile?.badge_id === badge.id;

      return (
        <div
          key={badge.id}
          className={
            "relative flex flex-col items-center justify-between rounded-3xl border p-5 text-center min-h-[220px] transition " +
            (isUnlocked
              ? "bg-white"
              : "bg-neutral-50 text-neutral-400") +
            (isEquipped
              ? " ring-2 ring-yellow-400 border-yellow-400"
              : "")
          }
        >
          <div className="h-20 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={badge.image}
              alt={badge.label}
              className={
                "h-16 w-16 object-contain " +
                (!isUnlocked ? "opacity-60" : "")
              }
            />
          </div>

          <div className="mt-3 font-semibold text-sm">{badge.label}</div>
          <div className="mt-1 text-xs text-neutral-500">
            {badge.description}
          </div>

          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/70">
                <Lock className="h-5 w-5 text-white" />
              </div>
            </div>
          )}
        </div>
      );
    })}
  </div>
</TabsContent>

          </Tabs>
        </Card>
      </div>
    </>
  );
}
