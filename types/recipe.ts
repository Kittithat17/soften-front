export interface Comment {
    id: string;
    user: string;
    avatar?: string;
    text: string;
    timestamp: string;
  }
  
export interface Recipe {
    id: string;
    title: string;
    description: string;
    image: string;
    author: string;
    authorAvatar?: string;
    rating: number;
    totalRatings: number;
    cookTime: string;
    servings: number;
    categories: string[];
    ingredients: string[];
    instructions: string[];
    timestamp: string;
    comments: Comment[];
  }
  