"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const accountCards: { title: string; action: string; href?: string }[] = [
  { title: "Order History", action: "View details", href: "/orders" },
  { title: "Refer A Friend", action: "View details" },
];

const supportCards = [
  { title: "Chat with Customer Love", action: "Contact" },
  { title: "Help centre", action: "View details" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [userName, setUserName] = useState("Guest User");
  const [email, setEmail] = useState("guest@example.com");
  const [signingOut, setSigningOut] = useState(false);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();

        if (!isMounted) return;

        if (error) {
          throw error;
        }

        if (!data.user) {
          router.replace("/login");
          return;
        }

        const fullName = data.user.user_metadata?.full_name || data.user.email?.split("@", 1)[0] || "Customer";
        setUserName(fullName);
        setEmail(data.user.email || "No email provided");
      } catch (error) {
        if (isMounted) {
          setProfileError(
            error instanceof Error
              ? error.message
              : "Could not load your account details."
          );
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleSignOut() {
    setSigningOut(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
      setProfileError(
        error instanceof Error
          ? error.message
          : "Could not sign out. Please try again."
      );
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f3ef] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center justify-center">
          <nav className="flex items-center gap-8 rounded-full border border-[#dfe3dd] bg-[#0f5d4a] px-8 py-3 text-sm text-white shadow-sm">
            <Link href="/" className="transition hover:text-[#dfeadf]">Deliveries</Link>
            <Link href="/restaurants" className="transition hover:text-[#dfeadf]">Cookbook</Link>
            <Link href="/restaurants" className="transition hover:text-[#dfeadf]">Shop</Link>
            <Link href="/profile" className="border-b-2 border-[#b9d96a] pb-1 font-semibold text-[#dfeadf]">Account</Link>
          </nav>
          <button className="ml-auto hidden items-center gap-2 rounded-full border border-[#dfe3dd] bg-white px-4 py-2 text-sm font-medium text-[#173d34] shadow-sm lg:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#edf6ec] text-[#2d8a5a]">☰</span>
            Help
          </button>
        </header>

        <div className="mx-auto max-w-5xl pt-4">
          <h1 className="mb-8 text-center text-5xl font-black tracking-[-0.06em] text-[#1d2a27]">
            Account
          </h1>

          {profileError && (
            <p className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
              {profileError}
            </p>
          )}

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-black tracking-[-0.05em] text-[#1f2d2b]">Personal Details</h2>
                <button className="flex items-center gap-2 rounded-xl bg-[#a4c760] px-4 py-2.5 text-sm font-semibold text-[#173d34] shadow-sm transition hover:bg-[#96be57]">
                  <span>✏</span>
                  Edit
                </button>
              </div>

              <div className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-base text-[#2e392f]">Name</span>
                  <div className="rounded-xl border border-[#d7d8d1] bg-white px-4 py-3 text-[#3d4d49] shadow-sm">
                    <input
                      value={userName}
                      readOnly
                      className="w-full border-0 bg-transparent text-base text-[#3d4d49] outline-none"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-base text-[#2e392f]">Email address</span>
                  <div className="rounded-xl border border-[#d7d8d1] bg-white px-4 py-3 text-[#3d4d49] shadow-sm">
                    <input
                      value={email}
                      readOnly
                      className="w-full border-0 bg-transparent text-base text-[#3d4d49] outline-none"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-base text-[#2e392f]">Mobile number</span>
                  <div className="rounded-xl border border-[#d7d8d1] bg-white px-4 py-3 text-[#3d4d49] shadow-sm">
                    <p className="text-base text-[#66736e]">
                      Add your phone number when placing an order.
                    </p>
                  </div>
                </label>

                <p className="text-sm text-[#66736e]">
                  To change your password, use the password reset option on the sign-in page.
                </p>
              </div>

              <div className="mt-10">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-3xl font-black tracking-[-0.05em] text-[#1f2d2b]">Payment Details</h2>
                  <span className="rounded-lg bg-[#edf5e9] px-3 py-2 text-xs font-semibold text-[#38634a]">
                    Not available yet
                  </span>
                </div>

                <div className="rounded-xl border border-[#d7d8d1] bg-white p-5 shadow-sm">
                  <p className="text-[#51625c]">
                    Online card payments are not set up. Orders currently use cash on delivery.
                  </p>
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-[#d7d8d1] bg-[#f8f8f5] p-4 shadow-sm">
                <h2 className="mb-4 text-3xl font-black tracking-[-0.05em] text-[#1f2d2b]">Account</h2>

                <div className="space-y-4">
                  {accountCards.map((card) => (
                    <div key={card.title} className="flex items-center justify-between rounded-xl border border-[#d7d8d1] bg-white px-4 py-3 shadow-sm">
                      <span className="flex items-center gap-3 text-base font-medium text-[#2f3c39]">
                        <span className="text-[#58715d]">🧾</span>
                        {card.title}
                      </span>
                      {card.href ? (
                        <Link href={card.href} className="rounded-lg border border-[#d7d8d1] bg-[#f8f9f7] px-3 py-1.5 text-sm text-[#1a3d36] transition hover:border-[#a4c760]">
                          {card.action}
                        </Link>
                      ) : (
                        <button className="rounded-lg border border-[#d7d8d1] bg-[#f8f9f7] px-3 py-1.5 text-sm text-[#1a3d36] transition hover:border-[#a4c760]">
                          {card.action}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[#d7d8d1] bg-[#f8f8f5] p-4 shadow-sm">
                <h2 className="mb-4 text-2xl font-black tracking-[-0.05em] text-[#1f2d2b]">Need to get in touch with us?</h2>
                <div className="space-y-4">
                  {supportCards.map((card) => (
                    <div key={card.title} className="flex items-center justify-between rounded-xl border border-[#d7d8d1] bg-white px-4 py-3 shadow-sm">
                      <span className="flex items-center gap-3 text-base font-medium text-[#2f3c39]">
                        <span className="text-[#58715d]">{card.title.includes("Chat") ? "💬" : "❔"}</span>
                        {card.title}
                      </span>
                      <button className="rounded-lg border border-[#d7d8d1] bg-[#f8f9f7] px-3 py-1.5 text-sm text-[#1a3d36] transition hover:border-[#a4c760]">
                        {card.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#d7d8d1] bg-white px-5 py-4 text-lg font-semibold text-[#173d34] shadow-sm transition hover:border-[#a4c760] hover:bg-[#f9fbf7] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span className="text-xl">◔</span>
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
