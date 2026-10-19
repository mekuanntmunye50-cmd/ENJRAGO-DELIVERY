
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <Link href="/" className="text-2xl font-extrabold text-white">
            Enjera<span className="text-amber-400">Go</span>
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-7 text-gray-400">
            Authentic Ethiopian food, delivered to your door.
            Discover local restaurants and enjoy your favorite dishes.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-white">Quick Links</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/" className="hover:text-amber-400">Home</Link></li>
            <li><Link href="/restaurants" className="hover:text-amber-400">Restaurants</Link></li>
            <li><Link href="/orders" className="hover:text-amber-400">My Orders</Link></li>
            <li><Link href="/contact" className="hover:text-amber-400">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="font-bold text-white">Our Promise</h2>
          <p className="mt-4 text-sm leading-7 text-gray-400">
            Delicious local food, convenient ordering, and a better way
            to discover Ethiopian restaurants.
          </p>
        </div>
      </div>

      <div className="border-t border-gray-800 px-4 py-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} EnjeraGo. Built with care in Ethiopia.
      </div>
    </footer>
  );
}
