
import Link from "next/link";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="brand footer-logo">
              <span className="brand-mark">E</span>
              <span>
                Enjera<span className="brand-accent">Go</span>
              </span>
            </Link>

            <p>
              Bringing the rich flavors of Ethiopia to your
              doorstep, one delicious meal at a time.
            </p>
          </div>

          <div>
            <h3>Explore</h3>
            <Link href="/">Home</Link>
            <Link href="/restaurants">Restaurants</Link>
            <Link href="/cart">Your cart</Link>
          </div>

          <div>
            <h3>Your account</h3>
            <Link href="/login">Sign in</Link>
            <Link href="/register">Create account</Link>
            <Link href="/orders">My orders</Link>
          </div>

          <div>
            <h3>Need help?</h3>
            <Link href="/contact">Contact us</Link>
            <p>Fresh food. Local flavor. Delivered with care.</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} EnjeraGo. All rights
            reserved.
          </p>
          <p>Made with care for Ethiopian food lovers.</p>
        </div>
      </Container>
    </footer>
  );
}
