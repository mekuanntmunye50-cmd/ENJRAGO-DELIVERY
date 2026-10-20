
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { restaurants } from "../../../data/restaurants";

export default function RestaurantDetailPage() {
  const params = useParams<{ id: string }>();
  const restaurant = restaurants.find(
    (item) => String(item.id) === params.id
  );

  if (!restaurant) {
    return (
      <main className="restaurants-page">
        <h1>Restaurant not found</h1>
        <p>We couldn't find that restaurant.</p>
        <Link href="/restaurants">Back to restaurants</Link>
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

        <h2>Welcome to {restaurant.name}</h2>
        <p>
          Explore the restaurant's food selection and get ready
          to enjoy your next meal with EnjeraGo.
        </p>

        <p className="menu-next-step">
          The next milestone is to load this restaurant's menu
          and allow customers to add dishes to their cart.
        </p>
      </section>
    </main>
  );
}
