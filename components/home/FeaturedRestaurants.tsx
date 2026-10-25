
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Restaurant } from "@/data/restaurants";
import { apiRequest } from "@/lib/api";

export default function FeaturedRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    apiRequest<{ restaurants: Restaurant[] }>("/api/catalog")
      .then(({ restaurants: catalog }) => {
        if (isMounted) {
          setRestaurants(catalog.filter((restaurant) => restaurant.featured));
        }
      })
      .catch((caughtError: unknown) => {
        if (isMounted) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Could not load featured restaurants."
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="section featured-section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">HANDPICKED FOR YOU</span>
            <h2>Restaurants worth discovering</h2>
            <p>Find your next favorite meal close to home.</p>
          </div>

          <Link href="/restaurants" className="text-link">
            See all →
          </Link>
        </div>

        {error ? (
          <p role="alert" className="text-sm text-red-700">{error}</p>
        ) : (
          <div className="restaurant-grid">
            {restaurants.map((restaurant) => (
              <article className="restaurant-card" key={restaurant.id}>
                <Link
                  href={`/restaurant/${restaurant.id}`}
                  className="restaurant-image"
                >
                  <img src={restaurant.image} alt={restaurant.name} />
                  <span className="restaurant-badge">Featured</span>
                </Link>

                <div className="restaurant-info">
                  <div className="restaurant-title-row">
                    <h3>{restaurant.name}</h3>
                    <span className="rating">★ {restaurant.rating}</span>
                  </div>

                  <p>{restaurant.cuisine}</p>
                  <p className="restaurant-location">
                    📍 {restaurant.location}
                  </p>

                  <div className="restaurant-meta">
                    <span>◷ {restaurant.deliveryTime}</span>
                    <span>
                      {restaurant.deliveryFee === 0
                        ? "Free delivery"
                        : `ETB ${restaurant.deliveryFee} delivery`}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
