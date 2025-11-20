export interface PostResponse {
  owner_post: {
    user_id: number;
    username: string;
    profile_image: string;
    created_date: string;
    created_time: string;
  };
  post: {
    post_id: number;
    image_url: string;
    menu_name?: string;
    story?: string;
    categories_tags?: string[];
    ingredients_tags?: string[];
    ingredients?: string[];
    instructions?: string[];
    star?: number;

  };
}