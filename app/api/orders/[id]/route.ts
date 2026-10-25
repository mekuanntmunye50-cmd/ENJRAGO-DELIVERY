import { connection, NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/mysql/auth";
import { getDatabase } from "@/lib/mysql/db";

type OrderRow = {
  id: string;
  status: string;
  full_name: string;
  phone: string;
  city: string;
  area: string;
  street_address: string;
  instructions: string;
  subtotal: string | number;
  delivery_fee: string | number;
  total: string | number;
  created_at: Date | string;
};

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connection();

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Please sign in to view this order." }, { status: 401 });
  }

  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  try {
    const database = getDatabase();
    const [rows] = await database.execute(
      `SELECT id, status, full_name, phone, city, area, street_address,
              instructions, subtotal, delivery_fee, total, created_at
       FROM enjerago_orders
       WHERE id = ? AND customer_id = ?
       LIMIT 1`,
      [id, user.id]
    );
    const orderRow = (rows as OrderRow[])[0];

    if (!orderRow) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const [itemRows] = await database.execute(
      `SELECT id, food_name, unit_price, quantity
       FROM enjerago_order_items
       WHERE order_id = ?
       ORDER BY id ASC`,
      [id]
    );

    const order = {
      ...orderRow,
      subtotal: Number(orderRow.subtotal),
      delivery_fee: Number(orderRow.delivery_fee),
      total: Number(orderRow.total),
      created_at: new Date(orderRow.created_at).toISOString(),
      order_items: (itemRows as {
        id: number;
        food_name: string;
        unit_price: string | number;
        quantity: number;
      }[]).map((item) => ({
        ...item,
        id: String(item.id),
        unit_price: Number(item.unit_price),
        quantity: Number(item.quantity),
      })),
    };

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Could not load order details:", error);
    return NextResponse.json(
      { error: "Could not load this order. Check the database connection." },
      { status: 500 }
    );
  }
}
