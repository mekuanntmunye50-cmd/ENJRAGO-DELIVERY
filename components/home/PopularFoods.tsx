
import Link from "next/link";

const foods = [
  {
    id: "mixed-beyaynet",
    name: "Mixed Beyaynet",
    description: "A colorful selection of Ethiopian vegetarian dishes.",
    price: 220,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80",
    tag: "Vegetarian favorite",
  },
  {
    id: "traditional-platter",
    name: "Traditional Platter",
    description: "A generous platter inspired by Ethiopian home cooking.",
    price: 350,
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80",
    tag: "Customer favorite",
  },
  {
    id: "fresh-salad",
    name: "Fresh Garden Salad",
    description: "A refreshing mix of crisp vegetables and greens.",
    price: 180,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80",
    tag: "Fresh pick",
  },
];

export default function PopularFoods() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">GOOD FOOD, GREAT MOOD</span>
            <h2>Popular right now</h2>
            <p>Delicious ideas for your next meal.</p>
          </div>
        </div>

        <div className="food-grid">
          {foods.map((food) => (
            <article className="food-card" key={food.id}>
              <Link href={`/food/${food.id}`} className="food-image">
                <img src={food.image} alt={food.name} />
                <span className="food-tag">{food.tag}</span>
              </Link>

              <div className="food-info">
                <h3>{food.name}</h3>
                <p>{food.description}</p>
                <div className="food-bottom">
                  <strong>ETB {food.price}</strong>
                  <Link
                    href={`/food/${food.id}`}
                    className="add-food-button"
                    aria-label={`View ${food.name}`}
                  >
                    +
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
