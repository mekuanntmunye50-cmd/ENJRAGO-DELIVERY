"use client";

import Link from "next/link";
import { Suspense } from "react";

const statusSteps = [
  { title: "Order placed", active: true },
  { title: "Food is cooking", active: true },
  { title: "On the way", active: true },
  { title: "Delivered", active: false },
];

export default function OrderDetailsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading order details...</div>}>
      <OrderDetailsContent />
    </Suspense>
  );
}

function OrderDetailsContent() {
  return (
    <main className="min-h-screen bg-[#eef0ee] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
        <section className="rounded-[26px] border border-[#dfe4df] bg-[#f7f7f6] p-5 shadow-[0_15px_35px_rgba(31,52,45,0.05)]">
          <div className="flex items-center justify-between pb-4">
            <button className="text-2xl text-[#1a2723]">←</button>
            <p className="text-lg font-medium text-[#293632]">Contact Support</p>
            <span className="h-6 w-6" />
          </div>

          <div className="mt-4">
            <h1 className="text-[2.1rem] font-black tracking-[-0.06em] text-[#1d2a27]">Preparing your order...</h1>
            <p className="mt-2 text-base text-[#4f605b]">Arriving at 10:25 PM</p>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between gap-3">
              {statusSteps.map((step, index) => (
                <div key={step.title} className="flex flex-1 items-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${step.active ? "border-[#2fa16d] bg-[#2fa16d] text-white" : "border-[#d9e0dc] bg-white text-[#7a8582]"}`}>
                      {index === 0 ? "🛒" : index === 1 ? "🍲" : index === 2 ? "🛵" : "✓"}
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div className={`h-1.5 w-16 rounded-full ${step.active ? "bg-[#2fa16d]" : "bg-[#dfe4df]"}`} />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <div className="flex h-36 w-36 items-center justify-center rounded-[32px] bg-[#f0f4f2] text-6xl shadow-inner">🍲</div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[#dfe4df] bg-white p-4 shadow-sm">
            <h2 className="mb-5 text-2xl font-black tracking-[-0.05em] text-[#1d2a27]">Delivery details</h2>
            <div className="space-y-4 text-base text-[#2e3d39]">
              <div className="flex items-center gap-3 rounded-xl bg-[#f5f7f6] px-3 py-3">
                <span className="text-[#2ca36d]">📍</span>
                <div>
                  <p className="font-semibold">Address</p>
                  <p className="text-[#4c5b57]">200 w 45th St, New York, NY 19990, UK</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-[#f5f7f6] px-3 py-3">
                <span className="text-[#2ca36d]">🚚</span>
                <div className="flex w-full items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">Type</p>
                    <p className="text-[#4c5b57]">Meet at door</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-[#f5f7f6] px-3 py-3">
                <span className="text-[#2ca36d]">🧭</span>
                <div>
                  <p className="font-semibold">Service</p>
                  <p className="text-[#4c5b57]">Standard</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-[#dfe4df] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[#4d5f5d]">Order summary</p>
                <p className="mt-2 text-xl font-bold text-[#1d2a27]">Regula Brewed Coffee</p>
              </div>
              <p className="text-xl font-black text-[#1a2723]">$5.69</p>
            </div>
            <div className="mt-4 flex justify-center">
              <button className="rounded-xl border border-[#dfe4df] bg-[#f7f7f6] px-5 py-2 text-sm font-semibold text-[#1a2723]">
                View details
              </button>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[#edf0ee] pt-4 text-lg font-semibold text-[#1d2a27]">
              <span>Total paid</span>
              <span>$24.80</span>
            </div>
          </div>
        </section>

        <section className="rounded-[26px] border border-[#dfe4df] bg-[#f7f7f6] p-5 shadow-[0_15px_35px_rgba(31,52,45,0.05)]">
          <div className="flex items-center justify-between pb-4">
            <button className="text-2xl text-[#1a2723]">←</button>
            <p className="text-lg font-medium text-[#293632]">Contact Support</p>
            <span className="h-6 w-6" />
          </div>

          <div className="mt-4">
            <h1 className="text-[2.1rem] font-black tracking-[-0.06em] text-[#1d2a27]">Your order has been picked</h1>
            <p className="mt-2 text-base text-[#4f605b]">Arriving at 10:25 PM</p>
          </div>

          <div className="mt-8 flex items-center justify-between gap-3 rounded-full bg-white p-2 shadow-sm">
            {statusSteps.map((step, index) => (
              <div key={step.title} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${step.active ? "border-[#2fa16d] bg-[#2fa16d] text-white" : "border-[#d9e0dc] bg-[#f5f7f5] text-[#7a8582]"}`}>
                  {index === 0 ? "🍽" : index === 1 ? "👨‍🍳" : index === 2 ? "🛵" : "✓"}
                </div>
                {index < statusSteps.length - 1 && <div className={`h-1 w-10 rounded-full ${step.active ? "bg-[#2fa16d]" : "bg-[#dfe4df]"}`} />}
              </div>
            ))}
          </div>

          <div className="relative mt-8 overflow-hidden rounded-[24px] border border-[#dde3de] bg-[#edf0ee] p-2 shadow-inner">
            <div className="h-[260px] rounded-[18px] bg-[radial-gradient(circle_at_20%_20%,rgba(103,125,112,0.08),transparent_28%),linear-gradient(135deg,#f3f3f2,#e6e9e7)]">
              <div className="absolute inset-0 opacity-40">
                <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.25)_1px,transparent_1px)] bg-[size:26px_26px]" />
              </div>
              <div className="absolute left-[12%] top-[18%] h-5 w-5 rounded-full bg-[#5f8a7a] shadow-[0_0_0_8px_rgba(95,138,122,0.12)]" />
              <div className="absolute right-[22%] top-[32%] h-5 w-5 rounded-full bg-[#b77ad8] shadow-[0_0_0_8px_rgba(183,122,216,0.14)]" />
              <div className="absolute left-[38%] top-[62%] h-5 w-5 rounded-full bg-[#e6b941] shadow-[0_0_0_8px_rgba(230,185,65,0.14)]" />
              <div className="absolute left-[48%] top-[58%] h-5 w-5 rounded-full bg-[#b77ad8] shadow-[0_0_0_8px_rgba(183,122,216,0.14)]" />
              <div className="absolute left-[58%] top-[45%] h-5 w-5 rounded-full bg-[#b77ad8] shadow-[0_0_0_8px_rgba(183,122,216,0.14)]" />
              <div className="absolute left-[46%] top-[52%] h-16 w-16 rounded-full bg-[#2fa16d] text-white shadow-lg">🛵</div>
              <div className="absolute left-[38%] top-[52%] h-2 w-32 rounded-full bg-[#b77ad8]" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-[#1f5a4e] px-4 py-3 text-white shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xl">🕒</span>
              <span className="text-lg font-bold">Arriving in 4 mins</span>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold">10:25 PM</span>
          </div>

          <div className="mt-6 rounded-2xl border border-[#dfe4df] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2d2b4] text-lg">N</div>
                <div>
                  <p className="text-lg font-bold text-[#1d2a27]">Noah Anna</p>
                  <p className="text-sm text-[#5b6d68]">Joined Jul 2023</p>
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-[#f6f5ee] px-2 py-1 text-sm font-semibold text-[#e4a932]">
                <span>★</span> 4.3
              </div>
            </div>
            <p className="mt-3 text-sm text-[#4d5f5d]">Silver Toyota Prius Hybrid</p>

            <div className="mt-4 flex items-center gap-3">
              <button className="flex-1 rounded-full border border-[#dfe4df] bg-[#f7f7f6] px-4 py-3 text-sm font-semibold text-[#1d2a27]">Send Message (optional)</button>
              <button className="rounded-full border border-[#dfe4df] bg-[#f7f7f6] px-4 py-3 text-sm font-semibold text-[#1d2a27]">✦ Tip</button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
