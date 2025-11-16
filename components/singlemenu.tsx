//single menu detail page
// components/RecipeDetailPage.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Clock, Users, Star, Heart, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { Recipe } from "@/types/recipe";
import {
  ChefHat,
  Flame,
  Timer,
  Leaf,
  HeartPulse,
  CupSoda,
  Cookie,
  CakeSlice,
  MoonStar,
  Fish,
  Soup,
} from "lucide-react";
import { HeroHeader2 } from "./hero8-head2";
import { User } from "@/types/user";
import { useAuth } from "@/app/context/AuthContext";
import type { User as AppUser } from "@/types/user";

/** ---------- Local types (เข้มงวด, ไม่ใช้ any) ---------- */
type CategorySlug =
  | "one-dish"
  | "spicy"
  | "quick"
  | "vegetarian"
  | "healthy"
  | "drinks"
  | "snacks"
  | "dessert"
  | "halal"
  | "seafood"
  | "noodles"
  | "rice";

interface ApiPost {
  post_id: number | string;
  menu_name?: string;
  story?: string;
  image_url?: string;
  categories_tags?: Array<number | string>;
  ingredients_tags?: Array<number | string>;
  ingredient_names?: string[];
  ingredients?: Array<string | number>;
  instructions?: Array<string | number>;
}

interface ApiOwner {
  user_id?: number;
  username?: string;
  created_date?: string;
  created_time?: string;
}

interface ApiEnvelope {
  owner_post?: ApiOwner;
  post?: ApiPost;
}

/** ---------- UI config ---------- */
type CategoryItem = {
  id: CategorySlug;
  name: string;
  icon: LucideIcon;
  color: string;
};

const categories: CategoryItem[] = [
  { id: "one-dish", name: "One-dish", icon: ChefHat, color: "bg-yellow-500" },
  { id: "spicy", name: "Spicy", icon: Flame, color: "bg-red-500" },
  { id: "quick", name: "Quick (< 15 min)", icon: Timer, color: "bg-green-500" },
  { id: "vegetarian", name: "Vegetarian", icon: Leaf, color: "bg-green-600" },
  { id: "healthy", name: "healthy", icon: HeartPulse, color: "bg-emerald-500" },
  { id: "drinks", name: "drinks", icon: CupSoda, color: "bg-blue-500" },
  { id: "snacks", name: "snacks", icon: Cookie, color: "bg-purple-500" },
  { id: "dessert", name: "dessert", icon: CakeSlice, color: "bg-pink-500" },
  { id: "halal", name: "halal", icon: MoonStar, color: "bg-teal-500" },
  { id: "seafood", name: "seafood", icon: Fish, color: "bg-cyan-500" },
  { id: "noodles", name: "noodles", icon: Soup, color: "bg-orange-500" },
  { id: "rice", name: "Rice", icon: ChefHat, color: "bg-yellow-600" },
];

const CATEGORY_ID_TO_SLUG: Record<number, CategorySlug> = {
  1: "one-dish",
  2: "spicy",
  3: "quick",
  4: "vegetarian",
  5: "healthy",
  6: "drinks",
  7: "snacks",
  8: "dessert",
  9: "halal",
  10: "seafood",
  11: "noodles",
  12: "rice",
};

const INGREDIENT_ID_TO_NAME: Record<number, string> = {
  1: "Vegetable",
  2: "Fruit",
  3: "Meat",
  4: "Seafood",
  5: "Poultry",
  6: "Dairy",
  7: "Egg",
  8: "Grain",
  9: "Legume",
};

const labelToSlug = (s: string): CategorySlug =>
  s
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*/g, "")
    .replace(/\s+/g, "-") as CategorySlug;

/** ---------- Helpers (typed) ---------- */
const normalizeIngredientTags = (p: ApiPost): string[] => {
  // ถ้ามีชื่อมาอยู่แล้ว (เช่น ตอนสร้างโพสต์) ก็ใช้เลย
  if (Array.isArray(p.ingredient_names) && p.ingredient_names.length > 0) {
    return Array.from(new Set(p.ingredient_names.filter(Boolean)));
  }

  const raw = Array.isArray(p.ingredients_tags) ? p.ingredients_tags : [];

  // แปลงกรณีเป็นหมายเลข id
  const numericIds: number[] = raw
    .map((v) =>
      typeof v === "number" ? v : /^\d+$/.test(String(v)) ? Number(v) : NaN
    )
    .filter((n): n is number => Number.isFinite(n));

  if (numericIds.length > 0) {
    const names = numericIds
      .map((id) => INGREDIENT_ID_TO_NAME[id])
      .filter(Boolean);
    return Array.from(new Set(names));
  }

  // กรณีเป็น string ชื่ออยู่แล้ว
  const namesFromStrings = raw.map((v) => String(v).trim()).filter(Boolean);
  return Array.from(new Set(namesFromStrings));
};

type JwtPayload = {
  user_id?: number | string;
  id?: number | string;
  sub?: string;
};

function parseUserIdFromToken(token?: string | null): number | null {
  if (!token) return null;
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;
    const b64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(b64);
    const obj = JSON.parse(json) as JwtPayload;
    const raw =
      obj.user_id ??
      obj.id ??
      (obj.sub && /^\d+$/.test(obj.sub) ? obj.sub : null);
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

function getCurrentUserId(
  user?: AppUser | null,
  token?: string | null
): number | null {
  const direct =
    user && "id" in user
      ? Number((user as { id?: number | string }).id)
      : user && "user_id" in user
      ? Number((user as { user_id?: number | string }).user_id)
      : null;
  if (Number.isFinite(direct)) return Number(direct);
  return parseUserIdFromToken(token);
}

export default function RecipeDetailPage() {
  const { user: authUser, token } = useAuth();
  const myUserId = useMemo(
    () => getCurrentUserId(authUser, token),
    [authUser, token]
  );

  const params = useParams();
  const id = params?.id as string;
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Favorite functionality states
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const API = process.env.NEXT_PUBLIC_API_BASE!;
        const res = await fetch(`${API}/getpostbypostid/${id}`, {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch");

        const p = data.post;
        const u = data.owner_post;
        if (!p) throw new Error("No recipe found");

        const catSlugs: CategorySlug[] = (
          Array.isArray(p.categories_tags) ? p.categories_tags : []
        )
          .map((v: number | string) =>
            typeof v === "number"
              ? CATEGORY_ID_TO_SLUG[v]
              : labelToSlug(String(v))
          )
          .filter(Boolean) as CategorySlug[];

        const mapped: Recipe = {
          id: String(p.post_id),
          title: p.menu_name ?? "Untitled",
          description: p.story ?? "",
          image: p.image_url ?? "/default-image.png",
          author: { id: u?.user_id ?? 0, username: u?.username ?? "Unknown" },
          rating: 4.5,
          totalRatings: 0,
          cookTime: "30 นาที",
          servings: 1,
          categories: catSlugs,
          ingredients: Array.isArray(p.ingredients)
            ? p.ingredients.map(String)
            : [],
          ingredientsTags: normalizeIngredientTags(p),
          instructions: Array.isArray(p.instructions)
            ? p.instructions.map(String)
            : [],
          createdAt: `${u?.created_date ?? ""} ${u?.created_time ?? ""}`,
          comments: [],
        };

        setRecipe(mapped);

        // Check if already favorited
        if (token) {
          try {
            const favRes = await fetch(`${API}/api/getallfavoritepost`, {
              headers: { Authorization: `Bearer ${token}` },
              cache: "no-store",
            });
            if (favRes.ok) {
              const favData = await favRes.json();
              const posts = favData.posts || [];
              const isAlreadyFavorited = posts.some(
                (item: any) => String(item.post.post_id) === String(id)
              );
              setIsFavorited(isAlreadyFavorited);
            }
          } catch (err) {
            console.error("Failed to check favorite status:", err);
          }
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecipe();
  }, [id, token]);

  const toggleFavorite = async () => {
    if (!token) {
      alert("Please login to save posts");
      return;
    }

    setFavoriteLoading(true);
    try {
      const API = process.env.NEXT_PUBLIC_API_BASE!;

      if (isFavorited) {
        // Unfavorite
        const res = await fetch(`${API}/api/unfavoritepost/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          setIsFavorited(false);
          console.log("Unfavorited successfully");
        } else {
          throw new Error("Failed to unfavorite");
        }
      } else {
        // Favorite
        const res = await fetch(`${API}/api/favoritepost/${id}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          setIsFavorited(true);
          console.log("Favorited successfully");
        } else {
          throw new Error("Failed to favorite");
        }
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
      alert("Failed to save post. Please try again.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <HeroHeader2 />
        <main className="max-w-4xl mx-auto py-12 text-center">Loading…</main>
      </>
    );
  }

  if (error || !recipe) {
    return (
      <>
        <HeroHeader2 />
        <main className="max-w-4xl mx-auto py-12 text-center">
          <h1 className="text-2xl font-bold">{error ?? "ไม่พบสูตรอาหาร"}</h1>
          <Link href="/Menu">
            <Button className="mt-4">Go Back to Menu Page</Button>
          </Link>
        </main>
      </>
    );
  }

  const handleRating = (rating: number) => {
    setUserRating(rating);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setComment("");
      setIsSubmitting(false);
    }, 800);
  };

  const profileHref =
    myUserId != null && Number(recipe.author.id) === myUserId
      ? "/profile"
      : `/userprofile/${recipe.author.id}`;

  return (
    <>
      <HeroHeader2 />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8 pt-25">
        {/* Author Header */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Link
              href={profileHref}
              className="flex items-center space-x-3 p-1 group"
              aria-label={`go to profile ${recipe.author.username}`}
            >
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-lg transition">
                {recipe.author.username[0]}
              </div>
              <div className="cursor-pointer">
                <p className="text-sm font-semibold">
                  {recipe.author.username}
                </p>
                <p className="text-xs text-gray-500">{recipe.createdAt}</p>
              </div>
            </Link>

            {/* Favorite Button */}
            <button
              onClick={toggleFavorite}
              disabled={favoriteLoading}
              className={`p-3 rounded-full transition-all ${
                isFavorited
                  ? "bg-red-100 text-red-500"
                  : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-400"
              } ${favoriteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              aria-label={isFavorited ? "Unfavorite" : "Favorite"}
            >
              <Heart className={`h-6 w-6 ${isFavorited ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Image */}
          <div className="relative w-full overflow-hidden rounded-lg aspect-[4/3] md:aspect-[16/9]">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
            <p className="text-gray-600 mb-4">{recipe.description}</p>

            {/* Ingredient Tags */}
            {(recipe.ingredientsTags?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-2 my-2">
                {recipe.ingredientsTags!.slice(0, 4).map((t, i) => (
                  <span
                    key={i}
                    className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-md text-xs font-medium"
                  >
                    {t}
                  </span>
                ))}
                {recipe.ingredientsTags!.length > 4 && (
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs">
                    +{recipe.ingredientsTags!.length - 4}
                  </span>
                )}
              </div>
            )}

            <div className="flex flex-row flex-wrap gap-4 items-center text-sm text-gray-600">
              <div className="flex flex-wrap gap-2 my-4">
                {recipe.categories.map((catId) => {
                  const cat = categories.find((c) => c.id === catId);
                  return (
                    <span
                      key={catId}
                      className={`${
                        cat?.color || "bg-gray-400"
                      } text-white px-3 py-2 rounded-lg text-sm font-bold`}
                    >
                      {cat?.name || catId}
                    </span>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 md:flex md:items-center md:gap-6">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {recipe.cookTime}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" /> {recipe.servings} servings
                </span>
                <span className="flex items-center gap-1 col-span-2 md:col-span-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  {recipe.rating} ({recipe.totalRatings} Reviews)
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Ingredients */}
        <Card>
          <CardHeader>
            <CardTitle>Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 space-y-1">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-700 leading-relaxed">
                      {instruction}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rating */}
        <Card>
          <CardHeader>
            <CardTitle>Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  onClick={() => handleRating(r)}
                  className={`text-2xl ${
                    r <= userRating ? "text-yellow-400" : "text-gray-300"
                  } hover:text-yellow-400`}
                >
                  ★
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {userRating > 0 ? `You give ${userRating} Star` : "(rating)"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <CardTitle>Comments ({recipe.comments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCommentSubmit} className="space-y-4 mb-4">
              <Textarea
                placeholder="Comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button type="submit" disabled={isSubmitting || !comment.trim()}>
                {isSubmitting ? "Posting..." : "Post"}
              </Button>
            </form>
            <ul className="space-y-4">
              {recipe.comments.map((c) => (
                <li key={c.id} className="flex gap-3">
                  {/* Avatar */}
                  <Link
                    href={`/userprofile/${c.user.id}`}
                    className="shrink-0 relative"
                  >
                    <div className="w-10 h-10 rounded-full bg-yellow-400 text-white font-bold grid place-items-center">
                      {c.user.username[0]}
                    </div>
                  </Link>

                  {/* Comment content */}
                  <div className="flex-1">
                    <div className="inline-block rounded-2xl px-4 py-3 bg-gray-100 text-gray-800">
                      <Link
                        href={`/userprofile/${c.user.id}`}
                        className="font-semibold inline-block"
                      >
                        {c.user.username}
                      </Link>
                      <p className="leading-relaxed">{c.text}</p>
                    </div>

                    {/* Time */}
                    <div className="text-xs text-gray-500 mt-1">
                      {c.createdAt}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </>
  );
}