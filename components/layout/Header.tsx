
"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigation = [
    { label: "Home", href: "/" },
    { label: "Restaurants", href: "/restaurants" },
    { label: "My Orders", href: "/orders" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-green-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-700 text-2xl">
            🍽️
          </span>

          <span className="text-2xl font-extrabold tracking-tight text-green-800">
            Enjera<span className="text-amber-500">Go</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-gray-600 transition hover:text-green-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 sm:flex">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2 font-semibold text-green-800 transition hover:bg-green-50"
          >
            Sign In
          </Link>

          <Link
            href="/cart"
            className="rounded-xl bg-green-700 px-4 py-2.5 font-semibold text-white shadow-sm transition hover:bg-green-800"
          >
            🛒 Cart
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-gray-200 p-2 text-xl text-gray-700 md:hidden"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-medium text-gray-700 hover:text-green-700"
              >
                {item.label}
              </Link>
            ))}

            <Link href="/login" onClick={() => setMenuOpen(false)}>
              Sign In
            </Link>

            <Link href="/cart" onClick={() => setMenuOpen(false)}>
              🛒 Shopping Cart
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
