import { NextResponse } from "next/server";
import { connection } from "next/server";
import { getCurrentUser } from "@/lib/mysql/auth";

export async function GET() {
  await connection();

  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "You are not signed in." }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Could not read the current session:", error);
    return NextResponse.json(
      { error: "Authentication is not configured correctly." },
      { status: 500 }
    );
  }
}
