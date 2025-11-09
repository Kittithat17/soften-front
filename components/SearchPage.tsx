//components/SearchPage.tsx
"use client";

import { useEffect, useState } from "react";
import { Search, Plus, X, Star, Icon } from "lucide-react";
import { Recipe } from "@/types/recipe";

import { HeroHeader2 } from "./hero8-head2";
import type { LucideIcon } from "lucide-react";
import { Eye } from "lucide-react";
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
import Link from "next/link";

/** ---------- Types ---------- */
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
  title?: string;
  story?: string;
  Details?: string;
  image_url?: string;
  categories_tags?: Array<number | string>;
  ingredients_tags?: Array<number | string>;
  ingredient_names?: string[];
  ingredients?: string[];
  instructions?: string[];
}
interface ApiOwner {
  username?: string;
  profile_image?: string;
  created_date?: string;
  created_time?: string;
}

interface ApiEnvelope {
  owner_post?: ApiOwner;
  post?: ApiPost;
}
type ApiItem = ApiPost | ApiEnvelope;

const isEnvelope = (x: ApiItem): x is ApiEnvelope =>
  typeof (x as ApiEnvelope).post !== "undefined";

interface PostsResponse {
  posts?: Array<ApiPost | ApiEnvelope>;
  data?: Array<ApiPost | ApiEnvelope>;
}
const CATEGORY_ID_TO_SLUG: Record<number, string> = {
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
const labelToSlug = (s: string): CategorySlug =>
  s
    .toLowerCase()
    .replace(/\s*\([^)]*\)\s*/g, "")
    .replace(/\s+/g, "-") as CategorySlug;

// Available ingredients for filtering
const availableIngredients = [
  "Pork",
  "Rice",
  "Garlic",
  "Chili",
  "Egg",
  "Shrimp",
  "Chicken",
  "Fish",
  "Onion",
  "Soy sauce",
  "Lime",
  "น้ำปลา",
  "Sugar",
  "เห็ด",
  "ผัก",
  "Tomato",
  "ถั่วงอก",
  "Milk",
  "Beef",
  "Noodle",
];
type CategoryItem = {
  id: string;
  name: string;
  icon: LucideIcon; // เก็บตัวคอมโพเนนต์ไอคอน
  color: string;
};
// Categories with icons
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
  { id: "rice", name: "Rice", icon: ChefHat, color: "bg-yellow-600" },// ใช้ Soup เป็นตัวแทนก๋วยเตี๋ยว/เส้น
];

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showIngredientInput, setShowIngredientInput] = useState(false);
  const [newIngredient, setNewIngredient] = useState("");
  const API = process.env.NEXT_PUBLIC_API_BASE!;
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const INGREDIENT_ID_TO_NAME: Record<number, string> = {
    1:"Vegetable",2:"Fruit",3:"Meat",4:"Seafood",5:"Poultry",
    6:"Dairy",7:"Egg",8:"Grain",9:"Legume"
  };
  
  // ใช้เสมอเวลาจะ “ได้เลข” หรือ “ไม่มี ingredient_names”
// eslint-disable-next-line react-hooks/exhaustive-deps
const normalizeIngredientTags = (p: ApiPost): string[] => {
  // 1) ถ้า API/createdPayload มีชื่อมาแล้ว ใช้อันนี้
  if (Array.isArray(p.ingredient_names) && p.ingredient_names.length) {
    return Array.from(new Set(p.ingredient_names.filter(Boolean)));
  }

  const raw = p.ingredients_tags ?? [];

  // 2) ถ้าเป็น array ของ number (หรือ string ของตัวเลข) → map id -> name
  const asArray = Array.isArray(raw) ? raw : [];
  const numericIds = asArray
    .map((v) => {
      if (typeof v === "number") return v;
      const s = String(v).trim();
      return /^\d+$/.test(s) ? Number(s) : NaN;
    })
    .filter((n) => Number.isFinite(n)) as number[];

  if (numericIds.length > 0) {
    const names = Array.from(
      new Set(
        numericIds
          .map((id) => INGREDIENT_ID_TO_NAME[id])
          .filter(Boolean)
      )
    );
    return names;
  }
  const namesFromStrings = Array.from(
    new Set(
      asArray
        .map((v) => String(v).trim())
        .filter(Boolean)
    )
  );
  return namesFromStrings;
};
  useEffect(() => {
    let cancelled = false;

    const fetchRecipes = async () => {
      try {
        const res = await fetch(`${API}/getallpost`, { cache: "no-store" });
        const raw = (await res.json()) as unknown;

        let items: Array<ApiPost | ApiEnvelope> = [];
        if (Array.isArray(raw)) {
          items = raw as Array<ApiPost | ApiEnvelope>;
        } else if (raw && typeof raw === "object") {
          const r = raw as PostsResponse;
          if (Array.isArray(r.posts)) items = r.posts!;
          else if (Array.isArray(r.data)) items = r.data!;
        }

        const posts: ApiPost[] = items.map((it: ApiItem) =>
          isEnvelope(it) ? it.post! : it
        );
        
        // map --> Recipe
        const mapped: Recipe[] = posts.map((p, idx) => {
          const catSlugs: CategorySlug[] = (p.categories_tags ?? [])
            .map((v) => (typeof v === "number" ? CATEGORY_ID_TO_SLUG[v] : labelToSlug(String(v))))
            .filter(Boolean) as CategorySlug[];
        
          const ingTags: string[] = normalizeIngredientTags(p);
        
          const safeId = p.post_id != null && p.post_id !== "" ? String(p.post_id) : `tmp-${Date.now()}-${idx}`;
        
          return {
            id: safeId,
            title: p.menu_name || p.title || "Untitled",
            description: p.story || p.Details || "",
            image: p.image_url || "/default-image.png",
            author: { id: 0, username: "Unknown" },
            rating: 4.5,
            totalRatings: 0,
            cookTime: "30 นาที",
            servings: 1,
            categories: catSlugs,
            ingredients: p.ingredients ?? [],
            ingredientsTags: ingTags,              
            instructions: p.instructions ?? [],
            createdAt: "วันนี้",
            comments: [],
          };
        });

        if (!cancelled) setRecipes(mapped);
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Failed to load recipes.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRecipes();

    const onCreated = (e: Event) => {
      const evt = e as CustomEvent<ApiPost>;
      const detail = evt.detail;
      if (!detail) return;
    
      const catSlugs: CategorySlug[] = (detail.categories_tags ?? [])
        .map((v) =>
          typeof v === "number" ? CATEGORY_ID_TO_SLUG[v] : labelToSlug(String(v))
        )
        .filter(Boolean) as CategorySlug[];
    
      const ingTags: string[] = normalizeIngredientTags(detail); // ✅ เห็นแน่ เพราะย้ายออกมาแล้ว
    
      const safeId =
        detail.post_id != null && detail.post_id !== ""
          ? String(detail.post_id)
          : `tmp-${Date.now()}`;
    
      const newItem: Recipe = {
        id: safeId,
        title: detail.menu_name || detail.title || "Untitled",
        description: detail.story || detail.Details || "",
        image: detail.image_url || "/default-image.png",
        author: { id: 0, username: "Unknown" },
        rating: 4.5,
        totalRatings: 0,
        cookTime: "30 นาที",
        servings: 1,
        categories: catSlugs,
        ingredients: detail.ingredients ?? [],
        ingredientsTags: ingTags, // ✅ ชื่อแทนเลข
        instructions: detail.instructions ?? [],
        createdAt: "วันนี้",
        comments: [],
      };
    
      setRecipes((prev) => [newItem, ...prev]);
    };
    
    window.addEventListener("recipe:created", onCreated as EventListener);

    return () => {
      cancelled = true;
      window.removeEventListener("recipe:created", onCreated as EventListener);
    };
  }, [API, normalizeIngredientTags]);

  // วางไว้บนสุดของไฟล์ (เหนือ filteredRecipes)
  const minutesFrom = (cookTime: string) => {
    // รองรับ "30 นาที", "15 min", "8mins", "12" เป็นต้น
    const m = cookTime.match(/\d+/);
    return m ? parseInt(m[0], 10) : Number.POSITIVE_INFINITY;
  };

  const textIncludesAny = (text: string, words: string[]) => {
    const low = text.toLowerCase();
    return words.some((w) => low.includes(w.toLowerCase()));
  };

  const ingredientsIncludeAny = (ings: string[], words: string[]) =>
    ings.some((i) => textIncludesAny(i, words));

  // mapping predicate ต่อ category id
  // mapping predicate ต่อ category id
  const categoryPredicates: Record<string, (r: Recipe) => boolean> = {
    "one-dish": (r) => (r.categories ?? []).includes("one-dish"),

    spicy: (r) =>
      (r.categories ?? []).includes("spicy") ||
      textIncludesAny(r.title + " " + r.description, [
        "spicy",
        "เผ็ด",
        "chili",
        "พริก",
      ]) ||
      ingredientsIncludeAny(r.ingredients, ["chili", "พริก"]),

    quick: (r) => minutesFrom(r.cookTime) <= 15,

    vegetarian: (r) =>
      (r.categories ?? []).includes("vegetarian") ||
      !ingredientsIncludeAny(r.ingredients, [
        "หมู",
        "ไก่",
        "เนื้อ",
        "กุ้ง",
        "ปลา",
        "beef",
        "pork",
        "chicken",
        "shrimp",
        "fish",
      ]),

    healthy: (r) =>
      (r.categories ?? []).includes("healthy") ||
      textIncludesAny(r.description, [
        "healthy",
        "low fat",
        "low sugar",
        "คาลอรีต่ำ",
      ]),

    drinks: (r) => (r.categories ?? []).includes("drinks"),

    snacks: (r) => (r.categories ?? []).includes("snacks"),

    dessert: (r) => (r.categories ?? []).includes("dessert"),

    halal: (r) => (r.categories ?? []).includes("halal"),

    seafood: (r) =>
      (r.categories ?? []).includes("seafood") ||
      ingredientsIncludeAny(r.ingredients, [
        "shrimp",
        "fish",
        "กุ้ง",
        "ปลา",
        "ปลาหมึก",
      ]),

    noodles: (r) =>
      (r.categories ?? []).includes("noodles") ||
      textIncludesAny(r.title + " " + r.description, ["noodle", "เส้น", "ผัด"]),
  };

  // Filter recipes based on search criteria
  const filteredRecipes = recipes.filter((recipe) => {
    // Search by name
    const matchesSearch =
      !searchTerm ||
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by ingredients
    const matchesIngredients =
    selectedIngredients.length === 0 ||
    selectedIngredients.every((kw) => {
      const kwLow = kw.toLowerCase();
      const tags = (recipe.ingredientsTags ?? []).map((t) =>
        String(t).toLowerCase()
      );
      const ings = (recipe.ingredients ?? []).map((i) => i.toLowerCase());
  
      return tags.some((t) => t.includes(kwLow)) || ings.some((i) => i.includes(kwLow));
    });

    // Filter by categories (simplified - you can expand this logic)
    const matchesCategories =
      selectedCategories.length === 0 ||
      selectedCategories.every((catId) => {
        const predicate = categoryPredicates[catId];
        return predicate ? predicate(recipe) : true;
      });

    return matchesSearch && matchesIngredients && matchesCategories;
  });

  const addIngredient = (ingredient: string) => {
    if (ingredient && !selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
    setNewIngredient("");
    setShowIngredientInput(false);
  };

  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter((i) => i !== ingredient));
  };

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const clearAllFilters = () => {
    setSelectedIngredients([]);
    setSelectedCategories([]);
    setSearchTerm("");
  };

  return (
    <>
      <HeroHeader2 />

      <div className=" relative pt-20 bg-muted overflow-x-hidden">
        {/* Filters */}
        <div className=" bg-white mx-4 my-4 rounded-xl shadow-sm p-6 max-w-6xl xl:mx-auto">
          {/* Ingredient Filter */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  readOnly
                  placeholder="Filter by ingredients"
                  className="h-11 w-full px-4 rounded-lg border border-gray-300 bg-gray-50 cursor-pointer placeholder:text-gray-500 focus:outline-none"
                  onClick={() => setShowIngredientInput(true)}
                />
                <button
                  onClick={() => setShowIngredientInput(true)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center text-white hover:bg-yellow-600 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="h-11 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm whitespace-nowrap"
                >
                  Clear
                </button>
                <button
                  type="button"
                  className="h-11 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium whitespace-nowrap"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Ingredient Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedIngredients.map((ingredient) => (
                <div
                  key={ingredient}
                  className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                >
                  <span>{ingredient}</span>
                  <button
                    onClick={() => removeIngredient(ingredient)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Ingredient Input Modal */}
            {showIngredientInput && (
              <div className="mb-4 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                <div className="mb-3">
                  <input
                    type="text"
                    value={newIngredient}
                    onChange={(e) => setNewIngredient(e.target.value)}
                    placeholder="Type an ingredient and press Enter"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        addIngredient(newIngredient);
                      }
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {availableIngredients.map((ingredient) => (
                    <button
                      key={ingredient}
                      onClick={() => addIngredient(ingredient)}
                      className="px-3 py-2 bg-yellow-200 text-yellow-800 rounded-lg text-sm hover:bg-yellow-300 transition-colors"
                    >
                      {ingredient}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => setShowIngredientInput(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="text-blue-500 mr-2">🏷️</span>
              Categories
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {categories.map((category) => {
                const IconComp = category.icon;
                const active = selectedCategories.includes(category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-full border-2 transition-all ${
                      active
                        ? `${category.color} text-white border-transparent`
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <IconComp className="w-4 h-4" />
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-6xl mx-auto px-4 pb-8">
          {loading ? (
            <div className="text-center py-20 text-gray-500">
              Loading recipes...
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">{error}</div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-6">
                {filteredRecipes.length} Dishes Found
              </h2>

              {filteredRecipes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    Not Found
                  </h3>
                  <p className="text-gray-500 mb-4">try again</p>
                  <button
                    onClick={clearAllFilters}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Clear Filter
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRecipes.map((recipe) => (
                    <div
                      key={recipe.id}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-full h-60 object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-lg flex items-center space-x-1">
                          <span className="font-bold">
                            {recipe.rating.toFixed(1)}
                          </span>
                          <Star className="h-3 w-3 fill-current" />
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                          {recipe.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {recipe.description}
                        </p>

                        {/* Main Ingredients (Tag) */}
                        {(recipe.ingredientsTags?.length ?? 0) > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {recipe.ingredientsTags!.slice(0, 3).map((t, i) => (
                              <span
                                key={i}
                                className="bg-yellow-200 text-yellow-800 hover:bg-yellow-300 px-3 py-1 rounded-md text-xs"
                              >
                                {t}
                              </span>
                            ))}
                           
                            {recipe.ingredientsTags!.length > 3 && (
                              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-md text-xs">
                                +{recipe.ingredientsTags!.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Category badges */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(recipe.categories ?? []).map((catId) => {
                            const cat = categories.find((c) => c.id === catId);
                            return (
                              <span
                                key={catId}
                                className={`${
                                  cat?.color || "bg-gray-400"
                                } text-white px-3 py-1 rounded-md text-xs`}
                              >
                                {cat?.name || catId}
                              </span>
                            );
                          })}
                        </div>

                        <Link
                          href={`/Menu/${recipe.id}`}
                          className="w-full inline-flex items-center justify-center gap-3 rounded-lg bg-yellow-500 py-3 font-medium transition-colors hover:bg-yellow-600"
                        >
                          <Eye />
                          View Recipes
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
