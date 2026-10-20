
"use client";

import Link from "next/link";
import { useCart } from "./CartContext";
import { restaurants } from "../../data/restaurants";

export default function CartPage() {
  const {
    items,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    subtotal,
  } = useCart();

  const restaurant = items.length > 0
    ? restaurants.find(
        (item) => String(item.id) === String(items[0].restaurantId)
      )
    : undefined;

  const deliveryFee = items.length > 0
    ? restaurant?.deliveryFee ?? 0
    : 0;

  const total = subtotal + deliveryFee;

  return (
    <main className="cart-page">
      <div className="cart-page-heading">
        <p className="eyebrow">YOUR ENJERAGO ORDER</p>
        <h1>Shopping cart</h1>
        <p>Review your food before checking out.</p>
      </div>

      {items.length === 0 ? (
        <section className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Discover a delicious meal and add it to your cart.</p>

          <Link
            href="/restaurants"
            className="cart-primary-button"
          >
            Explore restaurants
          </Link>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            <div className="cart-items-heading">
              <h2>Your items ({items.length})</h2>

              <button type="button" onClick={clearCart}>
                Clear cart
              </button>
            </div>

            {items.map((item) => (
              <article className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>{item.price.toLocaleString()} ETB each</p>

                  <div className="quantity-controls">
                    <button
                      type="button"
                      aria-label={`Decrease ${item.name} quantity`}
                      disabled={item.quantity <= 1}
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      type="button"
                      aria-label={`Increase ${item.name} quantity`}
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="remove-item-button"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>

                <strong className="cart-item-total">
                  {(item.price * item.quantity).toLocaleString()} ETB
                </strong>
              </article>
            ))}
          </section>

          <aside className="cart-summary">
            <h2>Order summary</h2>

            <div>
              <span>Subtotal</span>
              <span>{subtotal.toLocaleString()} ETB</span>
            </div>

            <div>
              <span>Delivery fee</span>
              <span>{deliveryFee.toLocaleString()} ETB</span>
            </div>

            <div className="cart-grand-total">
              <strong>Total</strong>
              <strong>{total.toLocaleString()} ETB</strong>
            </div>

            <Link
              href="/checkout"
              className="cart-primary-button"
            >
              Continue to checkout
            </Link>

            <p>
              Review your delivery information on the next page
              before placing your order.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
