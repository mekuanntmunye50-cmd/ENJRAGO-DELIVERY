"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type OAuthProvider = "google" | "apple";

export default function OAuthButtons() {
  const [loadingProvider, setLoadingProvider] =
    useState<OAuthProvider | null>(null);
  const [error, setError] = useState("");

  async function signIn(provider: OAuthProvider) {
    setError("");
    setLoadingProvider(provider);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (authError) {
        setError(authError.message);
        setLoadingProvider(null);
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Could not start social sign-in."
      );
      setLoadingProvider(null);
    }
  }

  return (
    <>
      {error && (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <div className="mt-4 grid gap-3">
        <button
          type="button"
          disabled={loadingProvider !== null}
          onClick={() => void signIn("google")}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#d7d6d1] bg-white px-4 py-3 text-base font-semibold text-[#2a302e] shadow-sm transition hover:border-[#9eb7a9] disabled:cursor-wait disabled:opacity-60"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f4f8f5] text-sm font-bold text-[#3b7b68]">
            G
          </span>
          {loadingProvider === "google" ? "Connecting..." : "Continue with Google"}
        </button>
        <button
          type="button"
          disabled={loadingProvider !== null}
          onClick={() => void signIn("apple")}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#d7d6d1] bg-white px-4 py-3 text-base font-semibold text-[#2a302e] shadow-sm transition hover:border-[#9eb7a9] disabled:cursor-wait disabled:opacity-60"
        >
          <span className="text-xl"></span>
          {loadingProvider === "apple" ? "Connecting..." : "Continue with Apple"}
        </button>
      </div>
    </>
  );
}
