import { hash } from "bcryptjs";
import { NextResponse, type NextRequest } from "next/server";
import { assertAuthConfigured, createSession } from "@/lib/mysql/auth";
import { getDatabase } from "@/lib/mysql/db";

type RegisterBody = {
  fullName?: unknown;
  email?: unknown;
  password?: unknown;
};

export async function POST(request: NextRequest) {
  let body: RegisterBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (fullName.length < 2 || fullName.length > 120) {
    return NextResponse.json(
      { error: "Enter your name (2 to 120 characters)." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
    return NextResponse.json(
      { error: "Your password must be at least 8 characters and no more than 72 UTF-8 bytes." },
      { status: 400 }
    );
  }

  try {
    assertAuthConfigured();
    const passwordHash = await hash(password, 12);
    const database = getDatabase();
    const [result] = await database.execute(
      "INSERT INTO enjerago_users (full_name, email, password_hash) VALUES (?, ?, ?)",
      [fullName, email, passwordHash]
    );
    const userId = Number((result as { insertId: number }).insertId);
    const user = { id: userId, email, fullName };

    await createSession(user);
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ER_DUP_ENTRY"
    ) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in." },
        { status: 409 }
      );
    }

    console.error("Account registration failed:", error);
    return NextResponse.json(
      { error: "Could not create your account. Check the database configuration and try again." },
      { status: 500 }
    );
  }
}
