"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type OrderSummary = {
  id: string;
  status: string;
  total: number;
  created_at: string;
  order_items: { food_name: string; quantity: number }[];
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        const supabase = createClient();
        const { data: authData, error: authError } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        if (!authData.user) {
          router.replace("/login");
          return;
        }

        const { data, error: ordersError } = await supabase
          .from("orders")
          .select("id, status, total, created_at, order_items(food_name, quantity)")
          .order("created_at", { ascending: false });

        if (ordersError) {
          throw ordersError;
        }

        if (isMounted) {
          setOrders(data);
        }
      } catch (caughtError) {
        if (isMounted) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Could not load your orders."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [router]);

  const money = (amount: number) =>
    `${amount.toLocaleString("en-ET", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ETB`;

  return (
    <main className="min-h-screen bg-[#f4f3ef] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/profile" className="text-sm font-semibold text-[#1f5a4e] hover:underline">
          ← Back to account
        </Link>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-[#1d2a27]">
          Order history
        </h1>
        <p className="mt-2 text-gray-600">Review your recent orders and their status.</p>

        {loading && (
          <p className="mt-8 text-gray-600" role="status">Loading your orders...</p>
        )}

        {error && (
          <p className="mt-8 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && orders.length === 0 && (
          <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-gray-800">No orders yet</p>
            <p className="mt-2 text-gray-600">Your completed checkouts will appear here.</p>
            <Link href="/restaurants" className="mt-5 inline-block rounded-xl bg-[#2f7d46] px-5 py-3 font-semibold text-white">
              Browse restaurants
            </Link>
          </section>
        )}

        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#a4c760] hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#1d2a27]">
                      Order #{order.id.slice(0, 8)}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#edf5e9] px-3 py-1 text-sm font-semibold capitalize text-[#2f7d46]">
                    {order.status.replaceAll("_", " ")}
                  </span>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  {order.order_items.map((item) => `${item.quantity} × ${item.food_name}`).join(", ")}
                </p>
                <p className="mt-3 font-bold text-[#1d2a27]">{money(order.total)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
