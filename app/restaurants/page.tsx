
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Restaurant } from "../../data/restaurants";
import { apiRequest } from "@/lib/api";

type SortOption = "recommended" | "rating" | "fee" | "name";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<SortOption>("recommended");

  useEffect(() => {
    let isMounted = true;

    apiRequest<{ restaurants: Restaurant[]; menuItems: unknown[] }>("/api/catalog")
      .then(({ restaurants: loadedRestaurants }) => {
        if (isMounted) {
          setRestaurants(loadedRestaurants);
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Could not load restaurants."
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = [
    "All",
    ...Array.from(
      new Set(restaurants.map((restaurant) => restaurant.cuisine))
    ),
  ];

  const filteredRestaurants = useMemo(() => {
    const query = search.trim().toLowerCase();

    const results = restaurants.filter((restaurant) => {
      const matchesSearch =
        restaurant.name.toLowerCase().includes(query) ||
        restaurant.cuisine.toLowerCase().includes(query) ||
        restaurant.location.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || restaurant.cuisine === category;

      return matchesSearch && matchesCategory;
    });

    switch (sort) {
      case "rating":
        return results.sort((a, b) => b.rating - a.rating);

      case "fee":
        return results.sort(
          (a, b) => a.deliveryFee - b.deliveryFee
        );

      case "name":
        return results.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

      default:
        return results;
    }
  }, [search, category, sort, restaurants]);

  return (
    <main className="restaurants-page">
      <section className="restaurants-heading">
        <p className="eyebrow">DISCOVER YOUR NEXT FAVORITE</p>
        <h1>Find your perfect meal</h1>
        <p>
          Explore restaurants and enjoy the taste of Ethiopia,
          delivered to your door.
        </p>
      </section>

      <section className="restaurant-controls">
        <input
          type="search"
          placeholder="Search restaurants, cuisine, or location..."
          aria-label="Search restaurants"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          aria-label="Sort restaurants"
          value={sort}
          onChange={(event) =>
            setSort(event.target.value as SortOption)
          }
        >
          <option value="recommended">Recommended</option>
          <option value="rating">Highest rated</option>
          <option value="fee">Lowest delivery fee</option>
          <option value="name">Name: A–Z</option>
        </select>
      </section>

      <section className="restaurant-categories">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={category === item ? "active" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </section>

      <section className="restaurant-results">
        <div className="results-heading">
          <h2>Restaurants near you</h2>
          <span>{loading ? "Loading..." : `${filteredRestaurants.length} found`}</span>
        </div>

        {loadError ? (
          <div className="empty-results" role="alert">
            <h3>Could not load restaurants</h3>
            <p>{loadError}</p>
          </div>
        ) : loading ? (
          <p role="status">Loading restaurants...</p>
        ) : filteredRestaurants.length === 0 ? (
          <div className="empty-results">
            <h3>No restaurants found</h3>
            <p>Try another search or choose a different category.</p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
                setSort("recommended");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="restaurant-grid">
            {filteredRestaurants.map((restaurant) => (
              <article
                className="restaurant-card"
                key={restaurant.id}
              >
                <Link
                  className="restaurant-image-link"
                  href={`/restaurant/${restaurant.id}`}
                >
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                  />
                  {restaurant.featured && (
                    <span className="featured-badge">
                      Featured
                    </span>
                  )}
                </Link>

                <div className="restaurant-card-content">
                  <div className="restaurant-title-row">
                    <h3>{restaurant.name}</h3>
                    <span className="restaurant-rating">
                      ★ {restaurant.rating}
                    </span>
                  </div>

                  <p>{restaurant.cuisine}</p>
                  <p className="restaurant-location">
                    {restaurant.location}
                  </p>

                  <div className="restaurant-meta">
                    <span>{restaurant.deliveryTime}</span>
                    <span>
                      {restaurant.deliveryFee === 0
                        ? "Free delivery"
                        : `${restaurant.deliveryFee} ETB delivery`}
                    </span>
                  </div>

                  <Link
                    className="view-restaurant-button"
                    href={`/restaurant/${restaurant.id}`}
                  >
                    View restaurant →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
