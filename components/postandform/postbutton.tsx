//components/postandform/postbutton.tsx
import { useState } from "react";
import PostRecipeForm from "./PostRecipeForm";
import { useAuth } from "@/app/context/AuthContext";



export default function PostButton() {
    const [isPostFormOpen, setIsPostFormOpen] = useState(false);
    const { user, token } = useAuth();
    return(
        <>
        {token && user ? (
          <div>
            <button
              onClick={() => setIsPostFormOpen(true)}
              className=" md:block fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <PostRecipeForm
              isOpen={isPostFormOpen}
              onClose={() => setIsPostFormOpen(false)}
            />
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }