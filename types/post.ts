// types/post.ts
export interface PostResponse {
    post_id: number;
    menu_name: string;
    story: string;
    image_url: string;
    categories_tags: string[];
    ingredients_tags: string[];
    ingredients: string[];
    instructions: string[];
  }
  