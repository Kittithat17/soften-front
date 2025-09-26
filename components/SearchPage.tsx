"use client";

import { useState } from "react";
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

// Available ingredients for filtering
const availableIngredients = [
  "หมู",
  "ข้าว",
  "กระเทียม",
  "พริก",
  "ไข่",
  "กุ้ง",
  "ไก่",
  "ปลา",
  "หอม",
  "ขิง",
  "มะนาว",
  "น้ำปลา",
  "น้ำตาล",
  "เห็ด",
  "ผัก",
  "มะเขือเทศ",
  "ถั่วงอก",
  "นม",
  "เนื้อ",
  "เส้น",
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
  { id: "noodles", name: "noodles", icon: Soup, color: "bg-orange-500" }, // ใช้ Soup เป็นตัวแทนก๋วยเตี๋ยว/เส้น
];

interface SearchPageProps {
  recipes: Recipe[];
}

export default function SearchPage({ recipes }: SearchPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showIngredientInput, setShowIngredientInput] = useState(false);
  const [newIngredient, setNewIngredient] = useState("");
  

  // 👇 วางไว้บนสุดของไฟล์ (เหนือ filteredRecipes)
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
      selectedIngredients.every((ingredient) =>
        recipe.ingredients.some((recipeIngredient) =>
          recipeIngredient.toLowerCase().includes(ingredient.toLowerCase())
        )
      );

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
                    placeholder="พิมพ์วัตถุดิบที่ต้องการ..."
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
          <h2 className="text-xl font-bold  mb-6">
            {filteredRecipes.length} Dishes Found
          </h2>

          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">nahee</h3>
              <p className="text-gray-500 mb-4">nahee</p>
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

                    {/* Ingredient tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {recipe.ingredients
                        .slice(0, 3)
                        .map((ingredient, index) => {
                          const ingredientName = ingredient.split(" ")[0];
                          return (
                            <span
                              key={index}
                              className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs"
                            >
                              {ingredientName}
                            </span>
                          );
                        })}
                      {recipe.ingredients.length > 3 && (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          +{recipe.ingredients.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Category badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(recipe.categories ?? []).map((catId) => {
                        const cat = categories.find((c) => c.id === catId);
                        return (
                          <span
                            key={catId}
                            className={`${
                              cat?.color || "bg-gray-400"
                            } text-white px-3 py-1 rounded-full text-xs`}
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
        </div>

        {/* Recipe Detail Modal */}
        
      </div>
    </>
  );
}
