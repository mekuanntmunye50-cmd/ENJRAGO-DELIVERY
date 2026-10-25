import { compare } from "bcryptjs";
import { NextResponse, type NextRequest } from "next/server";
import { createSession } from "@/lib/mysql/auth";
import { getDatabase } from "@/lib/mysql/db";

type LoginBody = {
  email?: unknown;
  password?: unknown;
};

export async function POST(request: NextRequest) {
  let body: LoginBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Enter your email and password." }, { status: 400 });
  }

  try {
    const database = getDatabase();
    const [rows] = await database.execute(
      "SELECT id, full_name, email, password_hash FROM enjerago_users WHERE email = ? LIMIT 1",
      [email]
    );
    const userRow = (rows as {
      id: number;
      full_name: string;
      email: string;
      password_hash: string;
    }[])[0];

    if (!userRow || !(await compare(password, userRow.password_hash))) {
      return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
    }

    const user = {
      id: Number(userRow.id),
      fullName: userRow.full_name,
      email: userRow.email,
    };
    await createSession(user);
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Sign-in failed:", error);
    return NextResponse.json(
      { error: "Could not sign in. Check the database configuration and try again." },
      { status: 500 }
    );
  }
}
