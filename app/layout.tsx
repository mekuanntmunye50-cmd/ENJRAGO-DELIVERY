
import type { Metadata } from "next";
import { CartProvider } from "../app/cart/CartContext";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "EnjeraGo | Ethiopian Food Delivery",
  description: "Discover Ethiopian food and order your favorites with EnjeraGo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
