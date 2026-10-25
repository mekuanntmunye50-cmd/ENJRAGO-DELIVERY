"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (fullName.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
        }),
      });

      router.replace("/profile");
      router.refresh();
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Account registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#dfe8d8] px-4 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[26px] border border-[#d8d7d0] bg-[#f4f3ef] shadow-[0_20px_50px_rgba(23,58,42,0.08)] lg:grid-cols-[1.02fr_0.98fr]">
        <section className="relative bg-[#f5f3ee] px-8 py-8 sm:px-10 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0d3d2b] text-lg font-black text-[#f5f3ee] shadow-sm">
              N
            </div>
            <span className="text-3xl font-black tracking-[-0.08em] text-[#0f3d31]">
              NutriBite
            </span>
          </div>

          <div className="mt-8 max-w-xl px-1 pb-4">
            <h1 className="text-[3.2rem] font-black leading-[0.95] tracking-[-0.06em] text-[#0f3d31]">
              Good food,
              <br />
              great mood,
              <br />
              better life.
            </h1>

            <p className="mt-6 text-[1.05rem] font-medium text-[#365b4d]">
              Eat healthy, live happy.
            </p>

            <div className="mt-8 space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf7ec] text-xl text-[#2d8a5a]">
                  ✓
                </div>
                <div>
                  <p className="text-lg font-semibold text-[#1f2d2a]">100% Fresh Ingredients</p>
                  <p className="text-sm text-[#4a5a55]">Carefully selected for your health</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf7ec] text-xl text-[#2d8a5a]">
                  🍽
                </div>
                <div>
                  <p className="text-lg font-semibold text-[#1f2d2a]">Healthy & Delicious</p>
                  <p className="text-sm text-[#4a5a55]">Nutritious meals you’ll love</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf7ec] text-xl text-[#2d8a5a]">
                  ❤️
                </div>
                <div>
                  <p className="text-lg font-semibold text-[#1f2d2a]">Better Lifestyle</p>
                  <p className="text-sm text-[#4a5a55]">Small change, big difference</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex items-end justify-center">
            <div className="relative h-[330px] w-[92%] max-w-[520px] overflow-hidden rounded-[40%] bg-[#f7f5f0] shadow-[inset_0_0_0_1px_rgba(17,29,25,0.04)]">
              <div className="absolute left-1/2 top-4 h-28 w-28 -translate-x-1/2 rounded-full bg-[#f1efe8]" />
              <div className="absolute left-1/2 top-20 h-40 w-40 -translate-x-1/2 rounded-full border-[14px] border-[#e4d9d0] bg-[#f4efe2]" />
              <div className="absolute bottom-10 left-1/2 h-40 w-[72%] -translate-x-1/2 rounded-[45%] bg-[#f3efe4] shadow-[0_16px_30px_rgba(0,0,0,0.08)]" />
              <div className="absolute right-10 top-12 h-16 w-16 rounded-full border-[8px] border-[#7da521] bg-[#f7f3ec]" />
              <div className="absolute left-10 top-10 h-16 w-16 rounded-full border-[8px] border-[#7da521] bg-[#f7f3ec]" />
              <div className="absolute bottom-10 left-10 h-16 w-16 rounded-full bg-[#ece9dd]" />
              <div className="absolute bottom-14 right-16 h-20 w-20 rounded-full bg-[#f3d577] shadow-[inset_0_0_0_8px_rgba(255,255,255,0.4)]" />
              <div className="absolute bottom-20 left-1/2 h-20 w-20 -translate-x-1/2 rounded-full bg-[#e9f2d4]" />
            </div>
          </div>
        </section>

        <section className="bg-[#f5f3ef] px-6 py-8 sm:px-8 lg:px-10">
          <div className="flex justify-end pt-1">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#1d473e] transition hover:text-[#0d3d2b]">
              <span className="text-xl">←</span>
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="mx-auto mt-10 max-w-xl">
            <h2 className="text-center text-4xl font-black tracking-[-0.06em] text-[#1d2a27]">
              Create Your Account
            </h2>
            <p className="mt-3 text-center text-base text-[#53665f]">
              Join NutriBite and start your healthy journey today!
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
              <label className="block">
                <span className="sr-only">Full Name</span>
                <div className="flex items-center gap-3 rounded-xl border border-[#d7d6d1] bg-white px-4 py-3 shadow-sm">
                  <span className="text-[#6b7a73]">👤</span>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full border-0 bg-transparent text-base text-[#1b2f2b] outline-none placeholder:text-[#7d8783]"
                  />
                </div>
              </label>

              <label className="block">
                <span className="sr-only">Email Address</span>
                <div className="flex items-center gap-3 rounded-xl border border-[#d7d6d1] bg-white px-4 py-3 shadow-sm">
                  <span className="text-[#6b7a73]">✉</span>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full border-0 bg-transparent text-base text-[#1b2f2b] outline-none placeholder:text-[#7d8783]"
                  />
                </div>
              </label>

              <label className="block">
                <span className="sr-only">Password</span>
                <div className="flex items-center gap-3 rounded-xl border border-[#d7d6d1] bg-white px-4 py-3 shadow-sm">
                  <span className="text-[#6b7a73]">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full border-0 bg-transparent text-base text-[#1b2f2b] outline-none placeholder:text-[#7d8783]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="text-sm font-semibold text-[#4b5c57]"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="mt-2 text-xs text-[#6c7c77]">Password must be at least 8 characters</p>
              </label>

              <label className="block">
                <span className="sr-only">Confirm Password</span>
                <div className="flex items-center gap-3 rounded-xl border border-[#d7d6d1] bg-white px-4 py-3 shadow-sm">
                  <span className="text-[#6b7a73]">🔒</span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full border-0 bg-transparent text-base text-[#1b2f2b] outline-none placeholder:text-[#7d8783]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="text-sm font-semibold text-[#4b5c57]"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700" role="alert">
                  {error}
                </div>
              )}

              <label className="flex items-center gap-3 pt-2 text-sm text-[#374b46]">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  className="h-4 w-4 rounded border-[#9ca7a3] text-[#2f7d5c] accent-[#2f7d5c]"
                />
                <span>
                  I agree to the <Link href="/terms" className="font-semibold text-[#1c6c5d] underline">Terms of Service</Link> and <Link href="/privacy" className="font-semibold text-[#1c6c5d] underline">Privacy Policy</Link>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full rounded-xl bg-[#3a8c65] px-4 py-4 text-lg font-black uppercase tracking-[0.04em] text-white shadow-[0_8px_18px_rgba(58,140,101,0.35)] transition hover:bg-[#2f7d5c] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>

              <p className="text-center text-xs text-[#6a7874]">
                Your account is stored securely in the app database.
              </p>
            </form>

            <p className="mt-8 text-center text-sm text-[#475d58]">
              Already have an account? <Link href="/login" className="font-semibold text-[#1c6c5d]">Sign In</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
