"use client";

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { MenuItem } from "@/data/menu";
import { useCart } from "@/app/cart/CartContext";
import { apiRequest } from "@/lib/api";

export default function PopularFoods() {
  const { addItem } = useCart();
  const [foods, setFoods] = useState<MenuItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    apiRequest<{ menuItems: MenuItem[] }>("/api/catalog")
      .then(({ menuItems }) => {
        if (isMounted) {
          setFoods(menuItems.slice(0, 3));
        }
      })
      .catch((caughtError: unknown) => {
        if (isMounted) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Could not load menu items."
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="section popular-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">GOOD FOOD, GREAT MOOD</span>
            <h2>Popular right now</h2>
            <p>Delicious Ethiopian favorites for your next meal.</p>
          </div>
          <Link href="/restaurants" className="text-link">
            Explore the menu →
          </Link>
        </div>

        {error ? (
          <p role="alert" className="text-sm text-red-700">{error}</p>
        ) : (
          <div className="food-grid">
            {foods.map((food) => (
            <article className="food-card" key={food.id}>
              <Link href={`/food/${food.id}`} className="food-image">
                <img src={food.image} alt={food.name} />
                <span className="food-tag">{food.category}</span>
              </Link>

              <div className="food-info">
                <h3>{food.name}</h3>
                <p>{food.description}</p>
                <div className="food-bottom">
                  <strong>ETB {food.price.toLocaleString()}</strong>
                  <button
                    type="button"
                    className="add-food-button"
                    aria-label={`Add ${food.name} to cart`}
                    onClick={() =>
                      addItem({
                        id: food.id,
                        restaurantId: food.restaurantId,
                        name: food.name,
                        price: food.price,
                        image: food.image,
                      })
                    }
                  >
                    +
                  </button>
                </div>
                <Link
                  href={`/food/${food.id}`}
                  className="food-details-link"
                >
                  View details
                </Link>
              </div>
            </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
