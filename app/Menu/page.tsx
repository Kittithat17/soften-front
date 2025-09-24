'use client';
import { HeroHeader2 } from "@/components/hero8-head2"
import SearchPage from "@/components/SearchPage";
import { Recipe } from "@/types/recipe";


const mockRecipes: Recipe[] = [
    {
      id: '1',
      title: 'Phad Kaprao Mookrob',
      description: 'The famous Pad Krapao Moo recipe from Je Chong mainly uses minced or sliced...',
      image: 'https://lionbrand.com.au/wp-content/uploads/2024/05/Pad-Kra-Pao-Moo-Grob-with-Prik-Nam-Pla-1.jpg',
      author: 'คุณสมหญิง',
      authorAvatar: undefined,
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
      timestamp: '2 ชั่วโมงที่แล้ว',
      comments: [
        {
          id: '1',
          user: 'คุณมารี',
          text: 'อร่อยมากเลยค่ะ ทำตามแล้วสำเร็จ!',
          timestamp: '1 ชั่วโมงที่แล้ว'
        }
      ]
    },
];
    export default function SearchPageRoute() {
        return (
          <>
            <SearchPage recipes={mockRecipes} />
          </>
        );
      }