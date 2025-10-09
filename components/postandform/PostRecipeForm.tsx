'use client';

import { useEffect, useMemo, useState } from 'react';
import { X, Plus, Upload, Eye, EyeOff } from 'lucide-react';

//import RecipeCard from './RecipeCard';

interface PostRecipeFormProps {
  isOpen: boolean;
  onClose: () => void;
  //onSubmit: (recipe: Recipe) => void;
}
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

export default function PostRecipeForm({ isOpen, onClose}: PostRecipeFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'tom',
    cookTime: '',
    servings: 1,
    ingredients: [''],
    instructions: [''],
    image: null as File | null
  });

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const categories = [
    { id: 'tom', name: 'ต้ม' },
    { id: 'pad', name: 'ผัด' },
    { id: 'tod', name: 'ทอด' },
    { id: 'drink', name: 'เครื่องดื่ม' }
  ];
    // preview URL
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
          setImageError('รองรับเฉพาะ JPG, PNG, WebP');
          return null;
        }
        if (file.size > MAX_SIZE) {
          setImageError('ไฟล์ต้องไม่เกิน 10MB');
          return null;
        }
        setImageError(null);
        return file;
      };
    
      const onChoose = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = validateOneFile(e.target.files?.[0]);
        if (f) setFormData((p) => ({ ...p, image: f }));
        e.currentTarget.value = '';
      };
    
      const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const f = validateOneFile(e.dataTransfer.files?.[0]);
        if (f) setFormData((p) => ({ ...p, image: f }));
      };
    
      const removeImage = () => setFormData((p) => ({ ...p, image: null }));

  // Create preview recipe object
//   const previewRecipe: Recipe = {
//     id: 'preview',
//     title: formData.title || 'ชื่อสูตรอาหาร',
//     description: formData.description || 'คำอธิบายสูตรอาหาร',
//     image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop',
//     author: 'สมชาย',
//     authorAvatar: undefined,
//     rating: 0,
//     totalRatings: 0,
//     cookTime: formData.cookTime || '30 นาที',
//     servings: formData.servings,
//     category: categories.find(cat => cat.id === formData.category)?.name || 'ต้ม',
//     ingredients: formData.ingredients.filter(item => item.trim() !== '').length > 0
//       ? formData.ingredients.filter(item => item.trim() !== '')
//       : ['วัตถุดิบตัวอย่าง'],
//     instructions: formData.instructions.filter(item => item.trim() !== '').length > 0
//       ? formData.instructions.filter(item => item.trim() !== '')
//       : ['ขั้นตอนการทำตัวอย่าง'],
//     timestamp: 'เมื่อสักครู่',
//     comments: []
//   };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Filter out empty ingredients and instructions
    const cleanedIngredients = formData.ingredients.filter(item => item.trim() !== '');
    const cleanedInstructions = formData.instructions.filter(item => item.trim() !== '');

    if (!formData.title.trim()) {
      alert('กรุณาใส่ชื่อสูตรอาหาร');
      return;
    }

    if (cleanedIngredients.length === 0 || cleanedInstructions.length === 0) {
      alert('กรุณาเพิ่มวัตถุดิบและวิธีทำอย่างน้อย 1 รายการ');
      return;
    }

    // const newRecipe: Recipe = {
    //   id: Date.now().toString(),
    //   title: formData.title,
    //   description: formData.description,
    //   //category: categories.find(cat => cat.id === formData.category)?.name || 'ต้ม',
    //   cookTime: formData.cookTime,
    //   servings: formData.servings,
    //   ingredients: cleanedIngredients,
    //   instructions: cleanedInstructions,
    //   image: formData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop',
    //   //author: 'สมชาย',
    //   //authorAvatar: undefined,
    //   rating: 0,
    //   totalRatings: 0,
    //   //timestamp: 'เมื่อสักครู่',
    //   comments: []
    // };

    //onSubmit(newRecipe);

    // Reset form
    setFormData({
      title: '',
      description: '',
      category: 'tom',
      cookTime: '',
      servings: 1,
      ingredients: [''],
      instructions: [''],
      image: null
    });

    setIsPreviewMode(false);
    onClose();
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((item, i) => i === index ? value : item)
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((item, i) => i === index ? value : item)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75   flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {isPreviewMode ? 'Preview Your Recipe' : 'Share Your Recipe'}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                isPreviewMode
                  ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isPreviewMode ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span className="hidden sm:inline">Edit</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">Preview</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        {isPreviewMode ? (
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 text-center">
                ✨ Your recipe preview is shown here. Click Share to post it! ✨
              </p>
            </div>
            {/* <RecipeCard
              recipe={previewRecipe}
              onRatingChange={() => {}}
              onCommentAdd={() => {}}
            /> */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setIsPreviewMode(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Share
              </button>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recipe Image</label>

              {!previewUrl ? (
                <label
                  htmlFor="recipe-image"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  className={[
                    'w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition',
                    dragOver ? 'border-orange-400 bg-orange-50' : 'border-gray-300 hover:border-gray-400',
                  ].join(' ')}
                >
                  <Upload className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="text-gray-700 font-medium">Click or drag to upload</p>
                  <p className="text-sm text-gray-500 mt-1">JPG, PNG, WebP up to 10MB</p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50">
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Image
                    </span>
                  </div>
                  <input
                    id="recipe-image"
                    type="file"
                    className="sr-only"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onChoose}
                  />
                </label>
              ) : (
                <div className="inline-block">
                  <img src={previewUrl} alt="recipe" className="w-40 h-40 object-cover rounded-lg border" />
                  <div className="flex gap-2 mt-2">
                    <label
                      htmlFor="recipe-image-replace"
                      className="inline-flex items-center px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Replace
                    </label>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="inline-flex items-center px-3 py-1.5 border rounded-lg text-sm text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove
                    </button>
                  </div>
                  <input
                    id="recipe-image-replace"
                    type="file"
                    className="sr-only"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onChoose}
                  />
                </div>
              )}

              {imageError && <p className="text-sm text-red-600 mt-2">{imageError}</p>}
            </div>
            {/* Recipe Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Menu name *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="ex. Tom yam kung"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Tell us about this recipe..."
              />
            </div>

            {/* Category and Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cooktime *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cookTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, cookTime: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="เช่น 30 นาที"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serving *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.servings}
                  onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients *
                <span className="text-xs text-gray-500 ml-1">({formData.ingredients.filter(i => i.trim()).length} รายการ)</span>
              </label>
              <div className="space-y-2">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex space-x-2">
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={`Ingredient ${index + 1}`}
                    />
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="px-3 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addIngredient}
                  className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions *
                <span className="text-xs text-gray-500 ml-1">({formData.instructions.filter(i => i.trim()).length} Instructions)</span>
              </label>
              <div className="space-y-2">
                {formData.instructions.map((instruction, index) => (
                  <div key={index} className="flex space-x-2">
                    <div className="flex items-center justify-center w-8 h-12 bg-gray-100 rounded-lg text-sm font-medium text-gray-600">
                      {index + 1}
                    </div>
                    <textarea
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      rows={2}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={`Instruction ${index + 1}`}
                    />
                    {formData.instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        className="px-3 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addInstruction}
                  className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Share
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
