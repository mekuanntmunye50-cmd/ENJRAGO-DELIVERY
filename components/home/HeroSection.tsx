
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-content">
          <span className="eyebrow">
            YOUR FAVORITE ETHIOPIAN FLAVORS
          </span>

          <h1>
            A taste of home,
            <br />
            <span>delivered with love.</span>
          </h1>

          <p>
            From traditional injera platters to your favorite modern meals,
            discover delicious food from restaurants around you.
          </p>

          <div className="hero-actions">
            <Link href="/restaurants" className="button button-primary">
              Explore restaurants <span>→</span>
            </Link>

            <Link href="/restaurants" className="button button-secondary">
              Discover the menu
            </Link>
          </div>

          <div className="hero-trust">
            <span>✓ Local restaurants</span>
            <span>✓ Freshly prepared</span>
            <span>✓ Easy ordering</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-frame">
            <img
              src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85"
              alt="A colorful platter of freshly prepared food"
            />
          </div>

          <div className="hero-note">
            <span className="hero-note-icon">✦</span>
            <div>
              <strong>Made with care</strong>
              <p>Flavor in every bite</p>
            </div>
          </div>

          <div className="hero-decoration">✳</div>
        </div>
      </div>
    </section>
  );
}
