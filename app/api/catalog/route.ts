import { NextResponse } from "next/server";
import { connection } from "next/server";
import { getDatabase } from "@/lib/mysql/db";

export async function GET() {
  await connection();

  try {
    const database = getDatabase();
    const [restaurantRows] = await database.execute(
      `SELECT id, name, cuisine, location, rating, delivery_time,
              delivery_fee, image_url, featured
       FROM enjerago_restaurants
       WHERE is_open = TRUE
       ORDER BY featured DESC, name ASC`
    );
    const [menuRows] = await database.execute(
      `SELECT id, restaurant_id, name, description, price, image_url, category
       FROM enjerago_menu_items
       WHERE is_available = TRUE
       ORDER BY restaurant_id, name`
    );

    const restaurants = (restaurantRows as {
      id: string;
      name: string;
      cuisine: string;
      location: string;
      rating: string | number;
      delivery_time: string;
      delivery_fee: string | number;
      image_url: string;
      featured: boolean | number;
    }[]).map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      location: restaurant.location,
      rating: Number(restaurant.rating),
      deliveryTime: restaurant.delivery_time,
      deliveryFee: Number(restaurant.delivery_fee),
      image: restaurant.image_url,
      featured: Boolean(restaurant.featured),
    }));

    const menuItems = (menuRows as {
      id: string;
      restaurant_id: string;
      name: string;
      description: string;
      price: string | number;
      image_url: string;
      category: string;
    }[]).map((item) => ({
      id: item.id,
      restaurantId: item.restaurant_id,
      name: item.name,
      description: item.description,
      price: Number(item.price),
      image: item.image_url,
      category: item.category,
    }));

    return NextResponse.json({ restaurants, menuItems });
  } catch (error) {
    console.error("Could not load the restaurant catalog:", error);
    return NextResponse.json(
      { error: "Could not load the menu. Check the database connection." },
      { status: 500 }
    );
  }
}
