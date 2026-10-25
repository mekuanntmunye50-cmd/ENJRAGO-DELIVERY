
"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { MenuItem } from "../../../data/menu";
import { apiRequest } from "@/lib/api";

function FoodDetailContent() {
  const params = useParams<{ id: string }>();
  const foodId = params.id;
  const [food, setFood] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    apiRequest<{ menuItems: MenuItem[] }>("/api/catalog")
      .then(({ menuItems }) => {
        if (isMounted) {
          setFood(
            menuItems.find(
              (item) =>
                item.id === foodId ||
                item.name.toLowerCase().replace(/\s+/g, "-") ===
                  foodId.toLowerCase()
            ) ?? null
          );
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Could not load this menu item."
          );
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [foodId]);

  if (loading) {
    return <main className="p-6 text-center" role="status">Loading food details...</main>;
  }

  if (loadError) {
    return (
      <main className="restaurants-page">
        <h1>Could not load menu item</h1>
        <p role="alert">{loadError}</p>
        <Link href="/restaurants">Browse restaurants</Link>
      </main>
    );
  }

  if (!food) {
    return (
      <main className="restaurants-page">
        <h1>Food item not found</h1>
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

export default function FoodDetailPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading food details...</div>}>
      <FoodDetailContent />
    </Suspense>
  );
}
