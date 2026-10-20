
import Link from "next/link";
import { restaurants } from "@/data/restaurants";

export default function FeaturedRestaurants() {
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

        <div className="restaurant-grid">
          {restaurants
            .filter((restaurant) => restaurant.featured)
            .map((restaurant) => (
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
      </div>
    </section>
  );
}
