'use client';

import { X, Star, User, Clock } from 'lucide-react';
import { Recipe } from '@/types/recipe';

interface RecipeDetailModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
}

export default function RecipeDetailModal({ recipe, isOpen, onClose }: RecipeDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{recipe.author}</h3>
              <p className="text-sm text-gray-500">{recipe.timestamp}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Recipe Image */}
          <div className="relative mb-6">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-64 md:h-80 object-cover rounded-lg"
            />
            <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-2 rounded-lg flex items-center space-x-1">
              <span className="font-bold text-lg">{recipe.rating.toFixed(1)}</span>
              <Star className="h-4 w-4 fill-current" />
            </div>
          </div>

          {/* Recipe Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {recipe.title}
          </h1>

          {/* Category and Time Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
              <span>🍽️</span>
              <span>{recipe.categories}</span>
            </span>
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
              <span>🌶️</span>
              <span>เผ็ด</span>
            </span>
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{recipe.cookTime}</span>
            </span>
          </div>

          {/* Ingredient Tags */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {recipe.ingredients.slice(0, 5).map((ingredient, index) => {
                const ingredientName = ingredient.split(' ')[0];
                return (
                  <span
                    key={index}
                    className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    {ingredientName}
                  </span>
                );
              })}
              {recipe.ingredients.length > 5 && (
                <span className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg text-sm">
                  +{recipe.ingredients.length - 5} อื่นๆ
                </span>
              )}
            </div>
          </div>

          {/* Story Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">เรื่องราว :</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">
                {recipe.description ||
                  `${recipe.title} เป็นเมนูอาหารที่มีรสชาติเข้มข้น เหมาะสำหรับผู้ที่ชอบรสจัดจ้าน วัตถุดิบที่ใช้ล้วนแต่เป็นของสดใหม่ ทำให้ได้รสชาติที่แท้จริงของอาหารไทย เมนูนี้เป็นที่นิยมมากในหมู่คนไทย เพราะสามารถทำได้ง่าย และมีรสชาติที่น่ารับประทาน เสิร์ฟพร้อมข้าวสวยร้อนๆ จะทำให้อร่อยยิ่งขึ้น`
                }
              </p>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">วัตถุดิบ :</h2>
            <div className="bg-white border border-gray-200 rounded-lg">
              <ul className="divide-y divide-gray-200">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="px-4 py-3 flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-700">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">วิธีทำ :</h2>
            <div className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-700 leading-relaxed">{instruction}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-600">{recipe.rating.toFixed(1)}</div>
              <div className="text-sm text-gray-500">คะแนน</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{recipe.totalRatings}</div>
              <div className="text-sm text-gray-500">รีวิว</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{recipe.cookTime}</div>
              <div className="text-sm text-gray-500">เวลาทำ</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{recipe.servings}</div>
              <div className="text-sm text-gray-500">คน</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
