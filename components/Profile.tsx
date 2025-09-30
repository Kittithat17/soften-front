"use client";

import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { HeroHeader2 } from "./hero8-head2";

export default function Profile() {
  const posts = [
    { id: 1, img: "https://i.ibb.co/3hJxXmF/omelet.jpg" },
    { id: 2, img: "https://i.ibb.co/syjGV2j/tomyum.jpg" },
    { id: 3, img: "https://i.ibb.co/hf4LVxW/curry.jpg" },
  ];

  return (
    <>
    <HeroHeader2 />
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-6 pt-20">
      {/* Profile Card */}
      <Card className="p-4 rounded-2xl shadow-md flex flex-col md:flex-row gap-6 items-center">
        {/* Avatar + Level */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-yellow-300 flex items-center justify-center">
            <User className="w-10 h-10 text-black" />
          </div>
          <div className="mt-2 text-xs bg-gray-200 rounded-full px-3 py-1">
            Level 10
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-1 text-center md:text-left">
          <h2 className="text-lg font-semibold">Nithiwat Buaprommee</h2>
          <p className="text-sm text-gray-600">
            Total Post : <b>10</b> posts
          </p>
          <p className="text-sm text-gray-600">Brooksudlorgmail.com</p>
          <p className="text-sm text-gray-600">(+66) 81-456-1684</p>
          <p className="text-sm">
            ☕ Food enthusiast | 👨‍🍳 Home chef | 📍 Bangkok, Thailand <br />
            Sharing delicious recipes and food adventures ✨
          </p>
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

          {/* Posts */}
          <TabsContent value="posts">
            <div className="grid grid-cols-3 gap-2 p-4">
              {posts.map((p) => (
                <img
                  key={p.id}
                  src={p.img}
                  alt="food"
                  className="w-full rounded-lg object-cover"
                />
              ))}
            </div>
          </TabsContent>

          {/* Likes */}
          <TabsContent value="likes">
            <p className="p-4 text-sm text-gray-600">
              You have no liked posts yet.
            </p>
          </TabsContent>

          {/* Badges */}
          <TabsContent value="badges">
            <p className="p-4 text-sm text-gray-600">
              🏆 Badge list coming soon...
            </p>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
    </>
  );
}
