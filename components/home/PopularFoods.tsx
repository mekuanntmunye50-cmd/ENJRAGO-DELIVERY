"use client";

import Link from "next/link";
import { menuItems } from "@/data/menu";
import { useCart } from "@/app/cart/CartContext";

export default function PopularFoods() {
  const { addItem } = useCart();
  const foods = menuItems.slice(0, 3);

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
      </div>
    </section>
  );
}
