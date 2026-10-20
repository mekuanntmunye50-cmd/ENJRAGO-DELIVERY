
export type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

export const menuItems: MenuItem[] = [
  {
    id: "food-1",
    restaurantId: "1",
    name: "Special Beyaynetu",
    description: "A colorful selection of Ethiopian vegetarian dishes.",
    price: 220,
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=800",
    category: "Traditional",
  },
  {
    id: "food-2",
    restaurantId: "1",
    name: "Doro Wot",
    description: "Traditional spicy chicken stew served with injera.",
    price: 380,
    image:
      "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800",
    category: "Meat Dishes",
  },
  {
    id: "food-3",
    restaurantId: "1",
    name: "Shiro Wot",
    description: "Comforting Ethiopian chickpea stew served with injera.",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=800",
    category: "Vegetarian",
  },
  {
    id: "food-4",
    restaurantId: "2",
    name: "Fresh Garden Bowl",
    description: "A fresh mix of vegetables and healthy ingredients.",
    price: 250,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    category: "Vegetarian",
  },
  {
    id: "food-5",
    restaurantId: "2",
    name: "Avocado Salad",
    description: "Fresh avocado and seasonal vegetables.",
    price: 200,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800",
    category: "Vegetarian",
  },
  {
    id: "food-6",
    restaurantId: "3",
    name: "Ethiopian Coffee",
    description: "Freshly prepared Ethiopian coffee.",
    price: 80,
    image:
      "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800",
    category: "Drinks",
  },
  {
    id: "food-7",
    restaurantId: "3",
    name: "Coffee and Snack Combo",
    description: "A coffee served with a small traditional snack.",
    price: 150,
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
    category: "Snacks",
  },
];
