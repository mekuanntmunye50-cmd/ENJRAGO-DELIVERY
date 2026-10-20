
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="brand footer-brand">
            <span className="brand-mark">E</span>
            <span>
              Enjera<span className="brand-highlight">Go</span>
            </span>
          </Link>

          <p>
            Bringing Ethiopia&apos;s favorite flavors closer to your door.
            Good food, warm hospitality, delivered with care.
          </p>
        </div>

        <div>
          <h3>Explore</h3>
          <Link href="/">Home</Link>
          <Link href="/restaurants">Restaurants</Link>
          <Link href="/orders">My Orders</Link>
        </div>

        <div>
          <h3>Help</h3>
          <Link href="/contact">Contact us</Link>
          <Link href="/login">Your account</Link>
          <Link href="/cart">Shopping cart</Link>
        </div>

        <div>
          <h3>Our promise</h3>
          <p>Fresh flavors. Trusted restaurants. A better way to enjoy food.</p>
          <p className="footer-location">Made with ♥ in Ethiopia</p>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} EnjeraGo. All rights reserved.</p>
      </div>
    </footer>
  );
}
