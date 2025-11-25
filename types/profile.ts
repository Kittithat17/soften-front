
//profile.ts
export interface UserProfile {
    user_id?: number;          
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    aboutme: string;
    image_url: string;
    badge_id?: number | null;
  }
  