import { User } from "./user";

export interface Comment {
  id: number | string;
  text: string;
  user: User;
  createdAt: string;
}
  
  export interface Recipe {
    id: string;
    title: string;
    description: string;
    image: string;
    author: User;
    rating: number;
    totalRatings: number;
    cookTime: string;
    servings: number;
    categories: string[];
    ingredients: string[];
    ingredientsTags?: string[];
    instructions: string[];
    createdAt: string;
    comments: Comment[];
  }
  