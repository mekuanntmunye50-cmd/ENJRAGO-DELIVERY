
import Link from "next/link";

const categories = [
  { name: "Traditional", icon: "🍲", description: "Authentic local flavors" },
  { name: "Breakfast", icon: "🍳", description: "Start your day right" },
  { name: "Vegetarian", icon: "🥗", description: "Fresh and colorful" },
  { name: "Meat Dishes", icon: "🍖", description: "Hearty favorites" },
  { name: "Drinks", icon: "☕", description: "Coffee and refreshments" },
  { name: "Snacks", icon: "🥟", description: "Little bites of joy" },
];

export default function CategorySection() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">FIND YOUR FAVORITE</span>
            <h2>What are you craving?</h2>
            <p>Explore flavors for every mood and every moment.</p>
          </div>

          <Link href="/restaurants" className="text-link">
            View all restaurants →
          </Link>
        </div>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              href="/restaurants"
              key={category.name}
              className="category-card"
            >
              <span className="category-icon">{category.icon}</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
