// lib/badges.ts
export type BadgeMeta = {
    id: number;
    name: string;
    label: string;        // เอาไว้โชว์ใต้รูป
    description: string;  // เอาไว้โชว์ใน popup
    image: string;        // path ไปที่ /public
  };
  
  export const ALL_BADGES: BadgeMeta[] = [
    {
      id: 1,
      name: "first post",
      label: "1st Recipe Posted",
      description: "Posted your first recipe",
      image: "/badges/01-firstpost.png",
    },
    {
      id: 2,
      name: "got 5 star rate",
      label: "Got 5-Star Rating",
      description: "Received a 5-star rating on your recipe",
      image: "/badges/02-got-5-star.png",
    },
    {
      id: 3,
      name: "10 recipe posted",
      label: "Home Cook Hero",
      description: "Created 10 recipes",
      image: "/badges/03-10-recipes.png",
    },
    {
      id: 4,
      name: "25 recipe posted",
      label: "Chef's Disciple",
      description: "Created 25 recipes",
      image: "/badges/04-25-recipes.png",
    },
  ];
  
  export const getBadgeMeta = (id?: number | null) =>
    ALL_BADGES.find((b) => b.id === id) ?? null;
  