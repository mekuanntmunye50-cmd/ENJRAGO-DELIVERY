
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark">E</span>
          <span>
            Enjera<span className="brand-highlight">Go</span>
            <small className="brand-tagline">A taste of Ethiopia</small>
          </span>
        </Link>

        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/restaurants" onClick={() => setMenuOpen(false)}>
            Restaurants
          </Link>
          <Link href="/orders" onClick={() => setMenuOpen(false)}>
            My Orders
          </Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>

          <Link
            href="/login"
            className="nav-signin"
            onClick={() => setMenuOpen(false)}
          >
            Sign in
          </Link>

          <Link
            href="/cart"
            className="nav-cart"
            onClick={() => setMenuOpen(false)}
          >
            🛒 Cart
          </Link>
        </nav>
      </div>
    </header>
  );
}
