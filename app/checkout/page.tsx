
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../cart/CartContext";
import { createClient } from "@/lib/supabase/client";

type CheckoutForm = {
  fullName: string;
  phone: string;
  city: string;
  area: string;
  streetAddress: string;
  instructions: string;
};

const INITIAL_FORM: CheckoutForm = {
  fullName: "",
  phone: "",
  city: "",
  area: "",
  streetAddress: "",
  instructions: "",
};

const DELIVERY_FEE = 80;

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotal,
    cartCount,
    clearCart,
  } = useCart();

  const [form, setForm] = useState<CheckoutForm>(INITIAL_FORM);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutForm, string>>
  >({});
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const updateField = (
    field: keyof CheckoutForm,
    value: string
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitError("");
  };

  const validateForm = () => {
    const nextErrors: Partial<
      Record<keyof CheckoutForm, string>
    > = {};

    if (form.fullName.trim().length < 2) {
      nextErrors.fullName = "Please enter your full name.";
    }

    // Accepts common Ethiopian phone formats, including +251.
    const normalizedPhone = form.phone.replace(/[\s()-]/g, "");
    if (!/^(?:\+251|251|0)?9\d{8}$/.test(normalizedPhone) &&
        !/^(?:\+251|251|0)?7\d{8}$/.test(normalizedPhone)) {
      nextErrors.phone =
        "Enter a valid Ethiopian mobile number.";
    }

    if (!form.city.trim()) {
      nextErrors.city = "Please enter your city.";
    }

    if (!form.area.trim()) {
      nextErrors.area = "Please enter your area or neighborhood.";
    }

    if (form.streetAddress.trim().length < 5) {
      nextErrors.streetAddress =
        "Enter a more detailed delivery address.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    if (items.length === 0) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    if (paymentMethod !== "cod") {
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        setSubmitError("Please sign in before placing your order.");
        return;
      }

      const { data: orderId, error: orderError } = await supabase.rpc(
        "create_customer_order",
        {
          p_full_name: form.fullName.trim(),
          p_phone: form.phone.trim(),
          p_city: form.city.trim(),
          p_area: form.area.trim(),
          p_street_address: form.streetAddress.trim(),
          p_instructions: form.instructions.trim(),
          p_items: items.map(({ id, quantity }) => ({
            food_id: id,
            quantity,
          })),
        }
      );

      if (orderError) {
        throw orderError;
      }

      if (typeof orderId !== "string") {
        throw new Error("The order was created without a valid order ID.");
      }

      clearCart();
      router.push(`/orders/${orderId}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not place your order. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const money = (amount: number) =>
    `${amount.toLocaleString("en-ET", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ETB`;

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-20 text-center">
        <div className="text-6xl">🛒</div>
        <h1 className="mt-5 text-3xl font-bold text-gray-900">
          Your cart is empty
        </h1>
        <p className="mt-3 text-gray-600">
          Add some delicious Ethiopian food before checking out.
        </p>
        <Link
          href="/food"
          className="mt-7 inline-block rounded-xl bg-[#2f7d46] px-6 py-3 font-semibold text-white transition hover:bg-[#205b35]"
        >
          Explore food
        </Link>
      </main>
    );
  }

  return (
    <main className="checkout-page min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link
            href="/cart"
            className="text-sm font-medium text-[#2f7d46] hover:underline"
          >
            ← Back to cart
          </Link>

          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Checkout
          </h1>

          <p className="mt-2 text-gray-600">
            Almost there! Confirm your delivery details.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3"
        >
          <div className="space-y-7 lg:col-span-2">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">
                1. Customer information
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Who should receive this order?
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="fullName"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Full name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(event) =>
                      updateField("fullName", event.target.value)
                    }
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={
                      errors.fullName ? "fullName-error" : undefined
                    }
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#2f7d46] focus:ring-2 focus:ring-[#e3efdc]"
                  />
                  {errors.fullName && (
                    <p id="fullName-error" className="mt-1 text-sm text-red-600">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Phone number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={
                      errors.phone ? "phone-error" : undefined
                    }
                    placeholder="e.g. 0912345678 or +251912345678"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#2f7d46] focus:ring-2 focus:ring-[#e3efdc]"
                  />
                  {errors.phone && (
                    <p id="phone-error" className="mt-1 text-sm text-red-600">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">
                2. Delivery address
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Tell the rider where to deliver your food.
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    City *
                  </label>
                  <input
                    id="city"
                    name="city"
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(event) =>
                      updateField("city", event.target.value)
                    }
                    aria-invalid={Boolean(errors.city)}
                    placeholder="e.g. Addis Ababa"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#2f7d46] focus:ring-2 focus:ring-[#e3efdc]"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="area"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Area / neighborhood *
                  </label>
                  <input
                    id="area"
                    name="area"
                    autoComplete="address-level3"
                    value={form.area}
                    onChange={(event) =>
                      updateField("area", event.target.value)
                    }
                    aria-invalid={Boolean(errors.area)}
                    placeholder="e.g. Bole"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#2f7d46] focus:ring-2 focus:ring-[#e3efdc]"
                  />
                  {errors.area && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.area}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="streetAddress"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Detailed address *
                  </label>
                  <textarea
                    id="streetAddress"
                    name="streetAddress"
                    autoComplete="street-address"
                    rows={3}
                    value={form.streetAddress}
                    onChange={(event) =>
                      updateField("streetAddress", event.target.value)
                    }
                    aria-invalid={Boolean(errors.streetAddress)}
                    placeholder="Building name, house number, nearby landmark..."
                    className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#2f7d46] focus:ring-2 focus:ring-[#e3efdc]"
                  />
                  {errors.streetAddress && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.streetAddress}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="instructions"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Delivery instructions (optional)
                  </label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    rows={2}
                    value={form.instructions}
                    onChange={(event) =>
                      updateField("instructions", event.target.value)
                    }
                    placeholder="Any directions that can help the rider?"
                    className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-[#2f7d46] focus:ring-2 focus:ring-[#e3efdc]"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="text-xl font-bold text-gray-900">
                3. Payment method
              </h2>

              <label className="mt-5 flex cursor-pointer items-start gap-4 rounded-xl border-2 border-[#2f7d46] bg-[#edf5e9] p-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(event) =>
                    setPaymentMethod(event.target.value)
                  }
                  className="mt-1 accent-[#2f7d46]"
                />
                <span>
                  <span className="block font-bold text-gray-900">
                    Cash on delivery
                  </span>
                  <span className="mt-1 block text-sm text-gray-600">
                    Pay the rider when your food arrives.
                  </span>
                </span>
                <span className="ml-auto text-2xl" aria-hidden="true">
                  💵
                </span>
              </label>
            </section>
          </div>

          <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7 lg:sticky lg:top-6">
            <h2 className="text-xl font-bold text-gray-900">
              Order summary
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
            </p>

            <div className="mt-6 max-h-80 space-y-4 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">🍲</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="break-words font-semibold text-gray-900">
                      {item.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-gray-900">
                    {money(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-6 border-t border-dashed border-gray-300" />

            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-3 text-gray-600">
                <span>Subtotal</span>
                <span>{money(subtotal)}</span>
              </div>
              <div className="flex justify-between gap-3 text-gray-600">
                <span>Delivery fee</span>
                <span>{money(DELIVERY_FEE)}</span>
              </div>
              <div className="flex justify-between gap-3 border-t border-gray-200 pt-4 text-lg font-extrabold text-gray-900">
                <span>Total</span>
                <span>{money(subtotal + DELIVERY_FEE)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-7 w-full rounded-xl bg-[#2f7d46] px-5 py-4 font-bold text-white shadow-sm transition hover:bg-[#205b35] focus:outline-none focus:ring-4 focus:ring-[#d8ead0] disabled:cursor-wait disabled:opacity-70"
            >
              {isSubmitting ? "Placing order..." : "Place order"}
            </button>

            {submitError && (
              <p className="mt-4 text-sm leading-5 text-red-700" role="alert">
                {submitError}{" "}
                {submitError === "Please sign in before placing your order." && (
                  <Link href="/login" className="font-semibold underline">
                    Sign in
                  </Link>
                )}
              </p>
            )}

            <p className="mt-4 text-center text-xs leading-5 text-gray-500">
              Your order total is calculated from the current menu prices.
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
}
