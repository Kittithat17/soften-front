// components/postandform/PostRecipeForm.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  X,
  Plus,
  Upload,
  Eye,
  EyeOff,
  Clock,
  Users,
  Send,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PostRecipeFormProps {
  isOpen: boolean;
  onClose: () => void;
}
const INGREDIENT_NAME_TO_ID: Record<string, number> = {
    // master
    vegetable: 1, fruit: 2, meat: 3, seafood: 4, poultry: 5, dairy: 6, egg: 7, grain: 8, legume: 9,
    pork: 3, beef: 3, chicken: 5, shrimp: 4, fish: 4,
    eggs: 7, garlic: 1, chilies: 1, chilli: 1, chili: 1,
    rice: 8, vegetables: 1, fruits: 2, beans: 9, bean: 9, milk: 6,
  };
const SUGGESTED_ING_TAGS = [
  "Pork",
  "Rice",
  "Garlic",
  "Chilies",
  "Eggs",
  "Beef",
  "Chicken",
  "Shrimp",
  "Fish",
  "Vegetable",
  "Poultry",
  "Egg",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];
const CATEGORY_TAGS = [
  "One-dish",
  "Spicy",
  "Quick(<15 min)",
  "Vegetarian",
  "Healthy",
  "Drinks",
  "Snacks",
  "Dessert",
  "Halal",
  "Seafood",
  "Noodles",
  "Rice",
] as const;
type CategoryTag = (typeof CATEGORY_TAGS)[number];
const CATEGORY_ID_MAP: Record<CategoryTag, number> = {
  "One-dish": 1,
  Spicy: 2,
  "Quick(<15 min)": 3,
  Vegetarian: 4,
  Healthy: 5,
  Drinks: 6,
  Snacks: 7,
  Dessert: 8,
  Halal: 9,
  Seafood: 10,
  Noodles: 11,
  Rice: 12,
};
const CATEGORY_ID_TO_NAME: Record<number, CategoryTag> = Object.fromEntries(
    Object.entries(CATEGORY_ID_MAP).map(([name, id]) => [id, name as CategoryTag])
  ) as Record<number, CategoryTag>;
  
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

export default function PostRecipeForm({
  isOpen,
  onClose,
}: PostRecipeFormProps) {
  const { token } = useAuth();
  const router = useRouter();

  const [ingredientTags, setIngredientTags] = useState<string[]>([]);
  const [ingredientTagInput, setIngredientTagInput] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categories: ["One-dish"] as CategoryTag[],
    cookTime: "",
    servings: 1,
    ingredients: [""],
    instructions: [""],
    image: null as File | null,
  });
  // helper
  const norm = (s: string) => s.trim().replace(/\s+/g, " ");
  const addIngredientTag = (raw?: string) => {
    const v = norm(raw ?? ingredientTagInput);
    if (!v) return;
    if (!ingredientTags.includes(v)) setIngredientTags((xs) => [...xs, v]);
    setIngredientTagInput("");
  };
  const removeIngredientTag = (name: string) =>
    setIngredientTags((xs) => xs.filter((x) => x !== name));

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Preview URL for image
  const previewUrl = useMemo(
    () => (formData.image ? URL.createObjectURL(formData.image) : null),
    [formData.image]
  );
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // ------- Image helpers (single file) -------
  const validateOneFile = (file?: File | null) => {
    if (!file) return null;
    if (!ACCEPTED.includes(file.type)) {
      setImageError(
        "File type not supported. Please upload JPG, PNG, or WebP."
      );
      return null;
    }
    if (file.size > MAX_SIZE) {
      setImageError("File size exceeds 10MB limit.");
      return null;
    }
    setImageError(null);
    return file;
  };

  const onChoose = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = validateOneFile(e.target.files?.[0]);
    if (f) setFormData((p) => ({ ...p, image: f }));
    e.currentTarget.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = validateOneFile(e.dataTransfer.files?.[0]);
    if (f) setFormData((p) => ({ ...p, image: f }));
  };

  const removeImage = () => setFormData((p) => ({ ...p, image: null }));
  const ingredientNamesForPreview = Array.from(new Set(
    ingredientTags
      .map(t => INGREDIENT_NAME_TO_ID[t.toLowerCase()])
      .filter((id): id is number => typeof id === "number")
  )).map(id => INGREDIENT_ID_TO_NAME[id]);
  
  // ------- Submit -------
  const handleSubmit = async (e?: React.FormEvent) => {
    
    if (e) e.preventDefault();
    if (formData.categories.length === 0) {
      return alert("Please select at least one category");
    }
    if (formData.categories.length > 3) {
      return alert("Choose up to 3 categories only");
    }

    const cleanedIngredients = formData.ingredients.filter((i) => i.trim());
    const cleanedInstructions = formData.instructions.filter((i) => i.trim());

    if (!formData.title.trim()) return alert("Please enter a menu name");
    if (!cleanedIngredients.length || !cleanedInstructions.length)
      return alert("Please enter ingredients and instructions");

    
    const ingredientTagIdsRaw = ingredientTags
    .map(t => INGREDIENT_NAME_TO_ID[t.toLowerCase()])
    .filter((id): id is number => typeof id === "number");

    const ingredientTagIds = Array.from(new Set(ingredientTagIdsRaw));
    const ingredientNames  = ingredientTagIds.map(id => INGREDIENT_ID_TO_NAME[id]);
    
    const categoryIds = formData.categories.map((c) => CATEGORY_ID_MAP[c]);
    
    const body = new FormData();
    body.append("menu_name", formData.title);
    body.append("Details", formData.description.trim());
    body.append("categories_tags", JSON.stringify(categoryIds));
    body.append("ingredients_tags", JSON.stringify(ingredientTagIds));
    body.append("ingredients", JSON.stringify(cleanedIngredients));
    body.append("instructions", JSON.stringify(cleanedInstructions));
    if (formData.image) body.append("image", formData.image);

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/api/createpost`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Post failed");

      toast.success("Shared successfully!");
      const createdPayload = {
        post_id: data?.post?.post_id ?? data?.post_id ?? Date.now(),
        menu_name: formData.title,
        Details: formData.description.trim(),
        image_url: data?.post?.image_url ?? data?.image_url ?? "",
        categories_tags: categoryIds,           // number[]
        ingredients_tags: ingredientTagIds, 
        ingredient_names: ingredientNames,    // ⬅️ เปลี่ยนมาเป็น number[]
        ingredients: cleanedIngredients,
        instructions: cleanedInstructions,
      };

      window.dispatchEvent(
        new CustomEvent("recipe:created", { detail: createdPayload })
      );
      const key = "cookpedia:recent-posts";
      const recent = JSON.parse(localStorage.getItem(key) || "[]");
      localStorage.setItem(
        key,
        JSON.stringify([createdPayload, ...recent].slice(0, 20))
      );

      // reset
      setFormData({
        title: "",
        description: "",
        categories: ["One-dish"] as CategoryTag[],
        cookTime: "",
        servings: 1,
        ingredients: [""],
        instructions: [""],
        image: null,
      });
      setIngredientTags([]); // reset tag
      setIngredientTagInput("");
      setIsPreviewMode(false);
      onClose();
      router.push("/Menu");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      toast.error("เกิดข้อผิดพลาด: " + msg);
    } finally {
      setLoading(false);
    }
  };
  // ------- Ingredients / Instructions -------
  const addIngredient = () =>
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  const removeIngredient = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  const updateIngredient = (index: number, value: string) =>
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((item, i) =>
        i === index ? value : item
      ),
    }));

  const addInstruction = () =>
    setFormData((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }));
  const removeInstruction = (index: number) =>
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index),
    }));
  const updateInstruction = (index: number, value: string) =>
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.map((item, i) =>
        i === index ? value : item
      ),
    }));

  if (!isOpen) return null;

  // -------- Data used in preview card --------
  const preview = {
    title: formData.title || "ชื่อเมนูของคุณ",
    description: formData.description || "sadadad",
    image: previewUrl || "https://picsum.photos/800/600?blur=2",
    cookTime: formData.cookTime || "30 นาที",
    servings: formData.servings || 1,
    categoryNames: formData.categories, // ใช้ชื่อแท็กตรง ๆ
    ingredients: formData.ingredients.filter((x) => x.trim()),
    instructions: formData.instructions.filter((x) => x.trim()),
  };
  const MAX_CATS = 3;
  const toggleFormCategory = (name: CategoryTag) => {
    setFormData((prev) => {
      const sel = prev.categories;
      const has = sel.includes(name);
      if (has) return { ...prev, categories: sel.filter((c) => c !== name) };
      if (sel.length >= MAX_CATS) {
        toast.error(`เลือกได้ไม่เกิน ${MAX_CATS} Categorirs`);
        return prev;
      }
      return { ...prev, categories: [...sel, name] };
    });
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {isPreviewMode ? "Preview Your Recipe" : "Share Your Recipe"}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isPreviewMode
                  ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {isPreviewMode ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span>Edit</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        {isPreviewMode ? (
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-center text-sm text-gray-600">
              preview
            </div>

            <PreviewRecipeCard {...preview} ingredientNames={ingredientNamesForPreview} />


            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={() => setIsPreviewMode(false)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                แก้ไข
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin " />
                    <span>Loading....</span>
                  </>
                ) : (
                  <>
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Image *
              </label>
              {!previewUrl ? (
                <label
                  htmlFor="recipe-image"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  className={`w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition ${
                    dragOver
                      ? "border-orange-400 bg-orange-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <Upload className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="text-gray-700 font-medium">
                    Click or drag to upload
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, PNG, WebP up to 10MB
                  </p>
                  <input
                    id="recipe-image"
                    type="file"
                    className="sr-only"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onChoose}
                  />
                  {imageError && (
                    <p className="text-red-500 text-sm mt-2">{imageError}</p>
                  )}
                </label>
              ) : (
                <div>
                  <img
                    src={previewUrl}
                    className="w-40 h-40 object-cover rounded-lg border"
                  />
                  <div className="flex gap-2 mt-2">
                    <label
                      htmlFor="recipe-image-replace"
                      className="inline-flex items-center px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Replace
                    </label>
                    <input
                      id="recipe-image-replace"
                      type="file"
                      className="sr-only"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={onChoose}
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="px-3 py-1.5 border rounded-lg text-sm text-red-500 hover:bg-red-50"
                    >
                      ลบรูป
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Menu name *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, title: e.target.value }))
                }
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="ex. Tom yum kung"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Tell us about this recipe..."
              />
            </div>

            {/* Category */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Categories * (เลือกได้สูงสุด 3)
                </label>
                <span className="text-xs text-gray-500">
                  {formData.categories.length}/3 selected
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORY_TAGS.map((name) => {
                  const active = formData.categories.includes(name);
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => toggleFormCategory(name)}
                      className={`px-3 py-2 rounded-full border text-sm transition
            ${
              active
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
            }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ingredients (In details) */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Ingredients (In details) <span className="ml-1 text-gray-400">!</span>
    </label>
    {/* ช่องกรอกรายการวัตถุดิบทีละบรรทัด */}
    {formData.ingredients.map((ing, i) => (
      <div key={i} className="flex gap-2 mb-2">
        <input
          value={ing}
          onChange={(e) => updateIngredient(i, e.target.value)}
          className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
          placeholder={`${i + 1}.`}
        />
        {formData.ingredients.length > 1 && (
          <button
            type="button"
            onClick={() => removeIngredient(i)}
            className="px-3 py-3 text-red-500 hover:bg-red-50 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    ))}

    <button
      type="button"
      onClick={addIngredient}
      className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border text-sm hover:bg-gray-50"
    >
      <Plus className="w-4 h-4" /> เพิ่มบรรทัด
    </button>
  </div>

            {/* Main Ingredients Tag */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Main Ingredients (Tag) <span className="ml-1 text-gray-400">!</span>
    </label>

    {/* ช่องพิมพ์ + ปุ่ม + */}
    <div className="flex gap-2 mb-2">
      <input
        value={ingredientTagInput}
        onChange={(e) => setIngredientTagInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); addIngredientTag(); }
        }}
        placeholder="Type your main ingredients here..."
        className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
      />
      <button
        type="button"
        onClick={() => addIngredientTag()}
        className="px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
        title="Add tag"
      >
        +
      </button>
    </div>

    {/* ปุ่ม + ชุดใหญ่เหมือนในภาพ (quick chips) */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-3">
      {SUGGESTED_ING_TAGS.map((t) => (
        <button
          type="button"
          key={t}
          onClick={() => addIngredientTag(t)}
          className="px-3 py-2 bg-yellow-200 text-yellow-800 rounded-lg text-sm hover:bg-yellow-300 transition-colors"
        >
          {t}
        </button>
      ))}
    </div>

    {/* แสดงแท็กที่เลือกแล้ว (ลบได้) */}
    <div className="flex flex-wrap gap-2">
      {ingredientTags.map((t) => (
        <span
          key={t}
          className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
        >
          {t}
          <button onClick={() => removeIngredientTag(t)} className="hover:text-yellow-900">
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      {!ingredientTags.length && (
        <span className="text-xs text-gray-400">ยังไม่มีแท็ก</span>
      )}
    </div>
  </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions (
                {formData.instructions.filter((i) => i.trim()).length})
              </label>
              {formData.instructions.map((ins, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <textarea
                    value={ins}
                    onChange={(e) => updateInstruction(i, e.target.value)}
                    rows={2}
                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder={`Step ${i + 1}`}
                  />
                  {formData.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(i)}
                      className="px-3 py-3 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addInstruction}
                className="flex items-center text-orange-600 hover:text-orange-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Step
              </button>
            </div>

            {/* Submit */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                {loading ? "กำลังโพสต์..." : "Share"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* -------------------------- Preview Card -------------------------- */
function PreviewRecipeCard({
    title,
    description,
    image,
    cookTime,
    servings,
    categoryNames,
    ingredientNames = [],
    ingredients,
    instructions,
  }: {
    title: string;
    description: string;
    image: string;
    cookTime: string;
    servings: number;
    categoryNames: string[];
    ingredientNames?: string[];
    ingredients: string[];
    instructions: string[];
  }) {
  return (
    <div className="border rounded-xl overflow-hidden shadow-sm">
      <img src={image} alt={title} className="w-full h-56 object-cover" />
      <div className="p-4 space-y-2">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        <div className="flex gap-4 text-sm text-gray-600 mt-2">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {cookTime}
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" /> {servings} ที่
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
    {ingredientNames.map((n) => (
      <span key={n} className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-md text-xs">
        {n}
      </span>
    ))}
  </div>
          <div className="flex gap-2 flex-wrap">
            {categoryNames.map((c) => (
              <span
                key={c}
                className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-md text-xs"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* ingredients */}
        <div className="mt-3">
          <h4 className="font-semibold text-gray-900 mb-1">วัตถุดิบ</h4>
          {ingredients.length ? (
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-0.5">
              {ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">ยังไม่ได้ใส่วัตถุดิบ</p>
          )}
        </div>

        {/* instructions */}
        <div className="mt-3">
          <h4 className="font-semibold text-gray-900 mb-1">วิธีทำ</h4>
          {instructions.length ? (
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-0.5">
              {instructions.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-gray-400">ยังไม่ได้ใส่วิธีทำ</p>
          )}
        </div>
      </div>
    </div>
  );
}
