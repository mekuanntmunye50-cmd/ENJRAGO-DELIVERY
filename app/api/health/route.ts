import { connection, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mysql/db";

const requiredTables = [
  "enjerago_users",
  "enjerago_restaurants",
  "enjerago_menu_items",
  "enjerago_orders",
  "enjerago_order_items",
];

export async function GET() {
  await connection();

  try {
    const database = getDatabase();
    const [rows] = await database.execute(
      `SELECT TABLE_NAME
       FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = DATABASE()
         AND TABLE_NAME IN (?, ?, ?, ?, ?)`,
      requiredTables
    );
    const foundTables = new Set(
      (rows as { TABLE_NAME: string }[]).map((row) => row.TABLE_NAME)
    );
    const missingTables = requiredTables.filter((table) => !foundTables.has(table));

    return NextResponse.json(
      {
        databaseConnected: true,
        schemaReady: missingTables.length === 0,
        missingTables,
      },
      { status: missingTables.length === 0 ? 200 : 503 }
    );
  } catch (error) {
    console.error("Database health check failed:", error);
    return NextResponse.json(
      {
        databaseConnected: false,
        schemaReady: false,
        error: "Cannot connect to the configured MySQL database.",
      },
      { status: 503 }
    );
  }
}
