
export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  location: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  featured: boolean;
};

export const restaurants: Restaurant[] = [
  {
    id: "addis-kitchen",
    name: "Addis Kitchen",
    cuisine: "Traditional Ethiopian",
    location: "Addis Ababa",
    rating: 4.8,
    deliveryTime: "25–35 min",
    deliveryFee: 45,
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: "green-platter",
    name: "The Green Platter",
    cuisine: "Vegetarian & Vegan",
    location: "Addis Ababa",
    rating: 4.7,
    deliveryTime: "20–30 min",
    deliveryFee: 35,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: "coffee-house",
    name: "Habesha Coffee House",
    cuisine: "Coffee & Breakfast",
    location: "Addis Ababa",
    rating: 4.9,
    deliveryTime: "15–25 min",
    deliveryFee: 30,
    image:
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
];
