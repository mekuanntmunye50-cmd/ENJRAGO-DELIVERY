import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=auth_callback", request.url));
  }

  try {
    const { url, anonKey } = getSupabaseConfig();
    const cookieStore = await cookies();
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Could not complete Supabase sign-in:", error.message);
      return NextResponse.redirect(new URL("/login?error=auth_callback", request.url));
    }

    return NextResponse.redirect(new URL("/profile", request.url));
  } catch (error) {
    console.error("Supabase auth callback failed:", error);
    return NextResponse.redirect(new URL("/login?error=auth_callback", request.url));
  }
}
