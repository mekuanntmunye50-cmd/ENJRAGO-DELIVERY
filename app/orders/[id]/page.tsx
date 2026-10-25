"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

type OrderItem = {
  id: string;
  food_name: string;
  unit_price: number;
  quantity: number;
};

type Order = {
  id: string;
  status: string;
  full_name: string;
  phone: string;
  city: string;
  area: string;
  street_address: string;
  instructions: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  created_at: string;
  order_items: OrderItem[];
};

const statusSteps = [
  { value: "placed", label: "Order placed" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "out_for_delivery", label: "On the way" },
  { value: "delivered", label: "Delivered" },
];

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading order details...</div>}>
      <OrderDetailsContent />
    </Suspense>
  );
}

function OrderDetailsContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOrder() {
      try {
        const { order } = await apiRequest<{ order: Order }>(
          `/api/orders/${encodeURIComponent(id)}`
        );

        if (isMounted) {
          setOrder(order);
        }
      } catch (caughtError) {
        if (isMounted) {
          if (caughtError instanceof Error && caughtError.message === "Please sign in to view this order.") {
            router.replace("/login");
            return;
          }
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Could not load this order."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [id, router]);

  const money = (amount: number) =>
    `${amount.toLocaleString("en-ET", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ETB`;

  if (loading) {
    return <main className="p-10 text-center text-gray-600">Loading order...</main>;
  }

  if (error || !order) {
    return (
      <main className="mx-auto max-w-2xl px-5 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Order unavailable</h1>
        <p className="mt-3 text-gray-600">
          {error || "This order could not be found or you do not have access to it."}
        </p>
        <Link
          href="/"
          className="mt-7 inline-block rounded-xl bg-[#2f7d46] px-6 py-3 font-semibold text-white"
        >
          Back to home
        </Link>
      </main>
    );
  }

  const isCancelled = order.status === "cancelled";
  const activeStep = statusSteps.findIndex((step) => step.value === order.status);
  const currentStatus = isCancelled
    ? "Order cancelled"
    : statusSteps.find((step) => step.value === order.status)?.label ??
      "Order received";

  return (
    <main className="min-h-screen bg-[#eef0ee] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-[#1f5a4e] hover:underline">
          ← Back to home
        </Link>

        <section className="mt-5 rounded-[26px] border border-[#dfe4df] bg-white p-5 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#58806d]">
                Order #{order.id.slice(0, 8)}
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-[#1d2a27]">
                {currentStatus}
              </h1>
              <p className="mt-2 text-sm text-[#5b6d68]">
                Placed {new Date(order.created_at).toLocaleString()}
              </p>
            </div>
            <span className="rounded-full bg-[#edf5e9] px-4 py-2 text-sm font-bold capitalize text-[#2f7d46]">
              {order.status.replaceAll("_", " ")}
            </span>
          </div>

          {!isCancelled && (
            <ol className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {statusSteps.map((step, index) => {
                const complete = activeStep >= index;
                return (
                  <li
                    key={step.value}
                    className={`rounded-xl border px-3 py-3 text-sm font-semibold ${
                      complete
                        ? "border-[#b9d8c2] bg-[#edf5e9] text-[#285c3a]"
                        : "border-gray-200 bg-gray-50 text-gray-500"
                    }`}
                  >
                    <span className="mr-2">{complete ? "✓" : "○"}</span>
                    {step.label}
                  </li>
                );
              })}
            </ol>
          )}

          <div className="mt-8 grid gap-6 border-t border-gray-100 pt-6 sm:grid-cols-2">
            <div>
              <h2 className="text-lg font-bold text-[#1d2a27]">Delivery details</h2>
              <p className="mt-3 font-semibold text-gray-800">{order.full_name}</p>
              <p className="text-sm text-gray-600">{order.phone}</p>
              <p className="mt-2 text-sm text-gray-600">
                {order.street_address}, {order.area}, {order.city}
              </p>
              {order.instructions && (
                <p className="mt-2 text-sm text-gray-500">
                  Note: {order.instructions}
                </p>
              )}
              <p className="mt-3 text-sm font-medium text-gray-600">
                Payment: Cash on delivery
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#1d2a27]">Order summary</h2>
              <ul className="mt-3 space-y-3">
                {order.order_items.map((item) => (
                  <li key={item.id} className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-700">
                      {item.quantity} × {item.food_name}
                    </span>
                    <span className="shrink-0 font-semibold text-gray-900">
                      {money(item.unit_price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{money(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery fee</span>
                  <span>{money(order.delivery_fee)}</span>
                </div>
                <div className="flex justify-between pt-2 text-lg font-black text-gray-900">
                  <span>Total</span>
                  <span>{money(order.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
