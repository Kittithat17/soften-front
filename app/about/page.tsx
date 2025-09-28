'use client';
import { useState } from "react";

export default function About() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isPostFormOpen, setIsPostFormOpen] = useState(false);

  
  return (
    <div className="min-h-screen bg-gray-50">
     
      
      {/* Floating Action Button for Desktop */}
      <button
        onClick={() => setIsPostFormOpen(true)}
        className="hidden md:block fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all hover:scale-110"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Post Recipe Form Modal */}
      {/* <PostRecipeForm
        isOpen={isPostFormOpen}
        onClose={() => setIsPostFormOpen(false)}
        onSubmit={handleRecipeSubmit}
      /> */}
    </div>
  );
}
