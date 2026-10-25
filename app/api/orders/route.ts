import { randomUUID } from "node:crypto";
import { connection, NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/mysql/auth";
import { getDatabase } from "@/lib/mysql/db";

type CheckoutBody = {
  fullName?: unknown;
  phone?: unknown;
  city?: unknown;
  area?: unknown;
  streetAddress?: unknown;
  instructions?: unknown;
  items?: unknown;
};

type MenuRow = {
  id: string;
  restaurant_id: string;
  name: string;
  price: string | number;
  image_url: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringField(value: unknown, maxLength: number) {
  return typeof value === "string" && value.trim().length <= maxLength
    ? value.trim()
    : null;
}

function getQuantity(quantities: Map<string, number>, id: string) {
  const quantity = quantities.get(id);
  if (quantity === undefined) {
    throw new Error("A validated order item has no quantity.");
  }
  return quantity;
}

export async function GET() {
  await connection();

  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Please sign in to view your orders." }, { status: 401 });
    }

    const database = getDatabase();
    const [rows] = await database.execute(
      `SELECT o.id, o.status, o.total, o.created_at,
              i.food_name, i.quantity
       FROM enjerago_orders AS o
       LEFT JOIN enjerago_order_items AS i ON i.order_id = o.id
       WHERE o.customer_id = ?
       ORDER BY o.created_at DESC, i.id ASC`,
      [user.id]
    );

    const orders = new Map<string, {
      id: string;
      status: string;
      total: number;
      created_at: string;
      order_items: { food_name: string; quantity: number }[];
    }>();

    for (const row of rows as {
      id: string;
      status: string;
      total: string | number;
      created_at: Date | string;
      food_name: string | null;
      quantity: number | null;
    }[]) {
      let order = orders.get(row.id);
      if (!order) {
        order = {
          id: row.id,
          status: row.status,
          total: Number(row.total),
          created_at: new Date(row.created_at).toISOString(),
          order_items: [],
        };
        orders.set(row.id, order);
      }
      if (row.food_name !== null && row.quantity !== null) {
        order.order_items.push({
          food_name: row.food_name,
          quantity: Number(row.quantity),
        });
      }
    }

    return NextResponse.json({ orders: [...orders.values()] });
  } catch (error) {
    console.error("Could not load order history:", error);
    return NextResponse.json(
      { error: "Could not load orders. Check the database connection." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Please sign in before placing your order." }, { status: 401 });
  }

  let body: CheckoutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fullName = stringField(body.fullName, 120);
  const phone = stringField(body.phone, 40);
  const city = stringField(body.city, 120);
  const area = stringField(body.area, 160);
  const streetAddress = stringField(body.streetAddress, 500);
  const instructions = stringField(body.instructions ?? "", 1000);
  const items = body.items;

  if (
    !fullName ||
    fullName.length < 2 ||
    !phone ||
    !city ||
    !area ||
    !streetAddress ||
    streetAddress.length < 5 ||
    instructions === null
  ) {
    return NextResponse.json({ error: "Complete all required delivery details." }, { status: 400 });
  }

  if (!/^(?:\+251|251|0)?9\d{8}$/.test(phone.replace(/[\s()-]/g, "")) &&
      !/^(?:\+251|251|0)?7\d{8}$/.test(phone.replace(/[\s()-]/g, ""))) {
    return NextResponse.json({ error: "Enter a valid Ethiopian mobile number." }, { status: 400 });
  }

  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return NextResponse.json({ error: "Your cart must contain menu items." }, { status: 400 });
  }

  const quantities = new Map<string, number>();
  for (const item of items) {
    if (
      !isRecord(item) ||
      typeof item.id !== "string" ||
      !/^[a-zA-Z0-9_-]{1,64}$/.test(item.id) ||
      typeof item.quantity !== "number" ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 99 ||
      quantities.has(item.id)
    ) {
      return NextResponse.json({ error: "Your cart contains an invalid menu item." }, { status: 400 });
    }
    quantities.set(item.id, item.quantity);
  }

  const database = getDatabase();
  const connection = await database.getConnection();
  let transactionStarted = false;

  try {
    await connection.beginTransaction();
    transactionStarted = true;
    const ids = [...quantities.keys()];
    const placeholders = ids.map(() => "?").join(", ");
    const [rows] = await connection.execute(
      `SELECT id, restaurant_id, name, price, image_url
       FROM enjerago_menu_items
       WHERE is_available = TRUE AND id IN (${placeholders})
       FOR UPDATE`,
      ids
    );
    const menuItems = rows as MenuRow[];

    if (menuItems.length !== ids.length) {
      await connection.rollback();
      return NextResponse.json(
        { error: "One or more menu items are unavailable. Refresh your cart and try again." },
        { status: 409 }
      );
    }

    const restaurantIds = new Set(menuItems.map((item) => item.restaurant_id));
    if (restaurantIds.size !== 1) {
      await connection.rollback();
      return NextResponse.json(
        { error: "All items in an order must come from the same restaurant." },
        { status: 400 }
      );
    }

    const subtotal = menuItems.reduce(
      (sum, item) => sum + Number(item.price) * getQuantity(quantities, item.id),
      0
    );
    const deliveryFee = 80;
    const orderId = randomUUID();
    const restaurantId = menuItems[0].restaurant_id;

    await connection.execute(
      `INSERT INTO enjerago_orders
        (id, customer_id, restaurant_id, full_name, phone, city, area,
         street_address, instructions, payment_method, status, subtotal,
         delivery_fee, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'cod', 'placed', ?, ?, ?)`,
      [
        orderId,
        user.id,
        restaurantId,
        fullName,
        phone,
        city,
        area,
        streetAddress,
        instructions,
        subtotal,
        deliveryFee,
        subtotal + deliveryFee,
      ]
    );

    for (const item of menuItems) {
      await connection.execute(
        `INSERT INTO enjerago_order_items
          (order_id, food_id, food_name, unit_price, quantity, image_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.id,
          item.name,
          Number(item.price),
          getQuantity(quantities, item.id),
          item.image_url,
        ]
      );
    }

    await connection.commit();
    return NextResponse.json({ orderId }, { status: 201 });
  } catch (error) {
    if (transactionStarted) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Could not roll back failed order transaction:", rollbackError);
      }
    }
    console.error("Could not create order:", error);
    return NextResponse.json(
      { error: "Could not place the order. Check the database connection and try again." },
      { status: 500 }
    );
  } finally {
    connection.release();
  }
}
