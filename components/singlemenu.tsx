"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Clock, Users, Star, ChevronLeft, LucideIcon } from "lucide-react";
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

//mockuser
const mockUsers: User[] = [
    { id: 1, username: "คุณสมหญิง" },
    { id: 2, username: "คุณมารี" },
  ];
  



// mock ข้อมูลตรงตาม type
const mockRecipes: Recipe[] = [
  {
    id: "1",
    title: "Phad Kaprao Mookrob",
    description:
      "The famous Pad Krapao Moo recipe from Je Chong mainly uses minced or sliced...",
    image:
      "https://lionbrand.com.au/wp-content/uploads/2024/05/Pad-Kra-Pao-Moo-Grob-with-Prik-Nam-Pla-1.jpg",
    author: mockUsers[0],
   
    rating: 4.8,
    totalRatings: 124,
    cookTime: "30 นาที",
    servings: 4,
    categories: ["one-dish", "spicy"],
    ingredients: [
      "กุ้งแม่น้ำ 300 กรัม",
      "เห็ดนางฟ้า 100 กรัม",
      "มะเขือเทศ 2 ลูก",
      "ใบมะกรูด 5 ใบ",
      "ตะไคร้ 2 ต้น",
      "ข่า 3 แว่น",
      "พริกขี้หนูแห้ง 5 เม็ด",
      "น้ำปลา 3 ช้อนโต๊ะ",
      "น้ำมะนาว 3 ช้อนโต๊ะ",
      "น้ำตาลปี๊บ 1 ช้อนโต๊ะ",
    ],
    instructions: [
      "ต้มน้ำในหม้อ ใส่ตะไคร้ ข่า ใบมะกรูด",
      "เติมกุ้งลงไป ต้มจนสุก",
      "ใส่เห็ดนางฟ้า มะเขือเทศ",
      "ปรุงรสด้วยน้ำปลา น้ำมะนาว น้ำตาลปี๊บ",
      "โรยด้วยพริกขี้หนูแห้ง เสิร์ฟร้อนๆ",
    ],
    createdAt: "2 ชั่วโมงที่แล้ว",
    comments: [
      {
        id: "1",
        user:  mockUsers[1],
        text: "อร่อยมากเลยค่ะ ทำตามแล้วสำเร็จ!",
        createdAt: "1 ชั่วโมงที่แล้ว",
      },
    ],
  },
];

export default function RecipeDetailPage() {
    const params = useParams();
    const id = params?.id as string;
    const recipe = mockRecipes.find((r) => r.id === id);
  
    const [userRating, setUserRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    if (!recipe) {
      return (
        <main className="max-w-4xl mx-auto py-12 text-center">
          <h1 className="text-2xl font-bold">ไม่พบสูตรอาหาร</h1>
          <Link href="/Menu">
            <Button className="mt-4">Go Back to Menu Page</Button>
          </Link>
        </main>
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
  
    return (
      <>
        <HeroHeader2 />
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-8 pt-25">
          {/* Author Header */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 p-1">
              {recipe.author.profile ? (
                <img
                  src={recipe.author.profile}
                  alt={recipe.author.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold">
                  {recipe.author.username[0]}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold">{recipe.author.username}</p>
                <p className="text-xs text-gray-500">{recipe.createdAt}</p>
              </div>
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
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex flex-wrap gap-2 my-4">
                  {recipe.categories.map((catId) => {
                    const cat = categories.find((c) => c.id === catId);
                    return (
                      <span
                        key={catId}
                        className={`${cat?.color || "bg-gray-400"} text-white px-3 py-1 rounded-full text-sm`}
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
                    <Users className="h-4 w-4" /> {recipe.servings} ที่
                  </span>
                  <span className="flex items-center gap-1 col-span-2 md:col-span-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    {recipe.rating} ({recipe.totalRatings} รีวิว)
                  </span>
                </div>
              </div>
            </div>
          </Card>
  
          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle>วัตถุดิบ</CardTitle>
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
              <CardTitle>วิธีทำ</CardTitle>
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
                  {isSubmitting ? "Posting..." : "Comment"}
                </Button>
              </form>
              <ul className="space-y-2">
                {recipe.comments.map((c) => (
                  <li key={c.id} className="border-b pb-2">
                    <p className="text-sm font-medium">{c.user.username}</p>
                    <p className="text-gray-700">{c.text}</p>
                    <p className="text-xs text-gray-500">{c.createdAt}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </main>
      </>
    );
  }
