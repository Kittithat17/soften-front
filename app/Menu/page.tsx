//Menu/page.tsx
'use client';

import PostButton from "@/components/postandform/postbutton";
import SearchPage from "@/components/SearchPage";
import { Recipe } from "@/types/recipe";
import { User } from "@/types/user";

const mockUsers: User[] = [
  { id: 1, username: "คุณสมหญิง" },
  { id: 2, username: "คุณมารี" },
];
const mockRecipes: Recipe[] = [
    {
      id: '1',
      title: 'Phad Kaprao Mookrob',
      description: 'The famous Pad Krapao Moo recipe from Je Chong mainly uses minced or sliced. pork belly stir-fried with holy basil and lots of chilies.',
      image: 'https://hungryinthailand.com/wp-content/uploads/2023/05/thai-basil-pork-belly-1.webp',
      author: mockUsers[0],
      
      rating: 4.8,
      totalRatings: 124,
      cookTime: '30 นาที',
      servings: 4,
      categories: ['one-dish', 'spicy'],
      ingredients: [
        'กุ้งแม่น้ำ 300 กรัม',
        'เห็ดนางฟ้า 100 กรัม',
        'มะเขือเทศ 2 ลูก',
        'ใบมะกรูด 5 ใบ',
        'ตะไคร้ 2 ต้น',
        'ข่า 3 แว่น',
        'พริกขี้หนูแห้ง 5 เม็ด',
        'น้ำปลา 3 ช้อนโต๊ะ',
        'น้ำมะนาว 3 ช้อนโต๊ะ',
        'น้ำตาลปี๊บ 1 ช้อนโต๊ะ'
      ],
      instructions: [
        'ต้มน้ำในหม้อ ใส่ตะไคร้ ข่า ใบมะกรูด',
        'เติมกุ้งลงไป ต้มจนสุก',
        'ใส่เห็ดนางฟ้า มะเขือเทศ',
        'ปรุงรสด้วยน้ำปลา น้ำมะนาว น้ำตาลปี๊บ',
        'โรยด้วยพริกขี้หนูแห้ง เสิร์ฟร้อนๆ'
      ],
      createdAt: '2 ชั่วโมงที่แล้ว',
      comments: [
        {
          id: '1',
          user: mockUsers[1],
          text: 'อร่อยมากเลยค่ะ ทำตามแล้วสำเร็จ!',
          createdAt: '1 ชั่วโมงที่แล้ว'
        }
      ]
    },
];

    export default function SearchPageRoute() {
        return (
          <>
            <SearchPage recipes={mockRecipes} />
            <PostButton />
          </>
        );
      }