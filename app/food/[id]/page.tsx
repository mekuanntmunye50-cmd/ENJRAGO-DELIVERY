
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { menuItems } from "../../../data/menu";

export default function FoodDetailPage() {
  const params = useParams<{ id: string }>();
  const foodId = params.id;

 const food = menuItems.find(
  (item) =>
    item.id === foodId ||
    item.name.toLowerCase().replace(/\s+/g, "-") ===
      foodId.toLowerCase()
);

  if (!food) {
    return (
      <main className="restaurants-page">
        <h1>Food item not found</h1>

        <p>
          Requested food ID: {foodId}
        </p>

        <p>
          Available food IDs:{" "}
          {menuItems.map((item) => item.id).join(", ")}
        </p>

        <Link href="/restaurants">
          Browse restaurants
        </Link>
      </main>
    );
  }

  return (
    <main className="restaurant-detail">
      <Link href={`/restaurant/${food.restaurantId}`}>
        ← Back to restaurant
      </Link>

      <img
        className="restaurant-detail-image"
        src={food.image}
        alt={food.name}
      />

      <section className="restaurant-detail-content">
        <p className="eyebrow">{food.category}</p>
        <h1>{food.name}</h1>
        <p>{food.description}</p>
        <h2>{food.price} ETB</h2>
      </section>
    </main>
  );
}
