export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and " +
      "NEXT_PUBLIC_SUPABASE_ANON_KEY to frontend/.env."
    );
  }

  let endpoint: URL;
  try {
    endpoint = new URL(url);
  } catch {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be a valid Supabase project URL."
    );
  }

  if (endpoint.protocol !== "https:" && endpoint.protocol !== "http:") {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must use HTTPS (or HTTP for local development)."
    );
  }

  if (endpoint.hostname === "your-project.supabase.co") {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is still the example value. Replace it with " +
      "the Project URL from your Supabase dashboard."
    );
  }

  if (anonKey === "your-supabase-publishable-or-anon-key") {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY is still the example value. Replace it " +
      "with the publishable/anon key from your Supabase dashboard."
    );
  }

  return { url, anonKey };
}
