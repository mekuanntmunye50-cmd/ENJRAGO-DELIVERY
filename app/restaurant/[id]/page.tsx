
"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Restaurant } from "../../../data/restaurants";
import type { MenuItem } from "../../../data/menu";
import { useCart } from "../../cart/CartContext";
import { apiRequest } from "@/lib/api";

function RestaurantDetailContent() {
  const params = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [restaurantMenu, setRestaurantMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const { addItem, cartCount } = useCart();

  useEffect(() => {
    let isMounted = true;

    apiRequest<{ restaurants: Restaurant[]; menuItems: MenuItem[] }>("/api/catalog")
      .then((catalog) => {
        if (!isMounted) return;

        const selectedRestaurant = catalog.restaurants.find(
          (item) => item.id === params.id
        );
        setRestaurant(selectedRestaurant ?? null);
        setRestaurantMenu(
          catalog.menuItems.filter((item) => item.restaurantId === params.id)
        );
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Could not load this restaurant."
          );
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  if (loading) {
    return <main className="p-6 text-center" role="status">Loading restaurant...</main>;
  }

  if (loadError) {
    return (
      <main className="restaurants-page">
        <h1>Could not load restaurant</h1>
        <p role="alert">{loadError}</p>
        <Link href="/restaurants">Back to restaurants</Link>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="restaurants-page">
        <h1>Restaurant not found</h1>
        <Link href="/restaurants">
          Back to restaurants
        </Link>
      </main>
    );
  }

  return (
    <main className="restaurant-detail">
      <Link className="back-link" href="/restaurants">
        ← Back to restaurants
      </Link>

      <img
        className="restaurant-detail-image"
        src={restaurant.image}
        alt={restaurant.name}
      />

      <section className="restaurant-detail-content">
        <p className="eyebrow">{restaurant.cuisine}</p>
        <h1>{restaurant.name}</h1>
        <p>{restaurant.location}</p>

        <div className="detail-facts">
          <span>★ {restaurant.rating} rating</span>
          <span>{restaurant.deliveryTime}</span>
          <span>
            {restaurant.deliveryFee === 0
              ? "Free delivery"
              : `${restaurant.deliveryFee} ETB delivery`}
          </span>
        </div>
      </section>

      <section className="menu-section">
        <div className="menu-heading">
          <div>
            <p className="eyebrow">MADE WITH CARE</p>
            <h2>Explore the menu</h2>
          </div>

          <Link href="/cart" className="menu-cart-link">
            Cart ({cartCount})
          </Link>
        </div>

        {restaurantMenu.length === 0 ? (
          <p>
            No menu items are available for this restaurant yet.
          </p>
        ) : (
          <div className="menu-grid">
            {restaurantMenu.map((food) => (
              <article className="menu-card" key={food.id}>
                <Link
                  href={`/food/${food.id}`}
                  className="menu-food-link"
                  aria-label={`View details for ${food.name}`}
                >
                  <img
                    src={food.image}
                    alt={food.name}
                  />
                </Link>

                <div className="menu-card-content">
                  <span className="menu-category">
                    {food.category}
                  </span>

                  <Link
                    href={`/food/${food.id}`}
                    className="menu-food-title-link"
                  >
                    <h3>{food.name}</h3>
                  </Link>

                  <p>{food.description}</p>

                  <div className="menu-card-bottom">
                    <strong>{food.price} ETB</strong>

                    <button
                      type="button"
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
                      + Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default function RestaurantDetailPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading restaurant details...</div>}>
      <RestaurantDetailContent />
    </Suspense>
  );
}
