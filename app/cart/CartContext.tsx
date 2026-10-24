
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string;
  restaurantId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type NewCartItem = Omit<CartItem, "quantity">;

type CartContextType = {
  items: CartItem[];
  addItem: (item: NewCartItem) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

const CART_STORAGE_KEY = "enjerago-cart";

function isValidCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.restaurantId === "string" &&
    typeof item.name === "string" &&
    typeof item.image === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity > 0
  );
}

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load the saved cart once when the application starts.
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);

      if (savedCart) {
        const parsed: unknown = JSON.parse(savedCart);

        if (Array.isArray(parsed)) {
          // Restore the persisted external state after client hydration.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setItems(parsed.filter(isValidCartItem));
        } else {
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      }
    } catch (error) {
      console.error("Could not load the saved cart:", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Save changes only after the initial cart has loaded.
  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error("Could not save the cart:", error);
    }
  }, [items, loaded]);

  const addItem = useCallback(
    (item: NewCartItem) => {
      if (
        items.length > 0 &&
        items[0].restaurantId !== item.restaurantId
      ) {
        window.alert(
          "Your cart contains food from another restaurant. " +
          "Please clear your cart before ordering from this restaurant."
        );
        return;
      }

      setItems((current) => {
        const existing = current.find(
          (entry) => entry.id === item.id
        );

        if (existing) {
          return current.map((entry) =>
            entry.id === item.id
              ? { ...entry, quantity: entry.quantity + 1 }
              : entry
          );
        }

        return [...current, { ...item, quantity: 1 }];
      });
    },
    [items]
  );

  const increaseQuantity = useCallback((id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }, []);

  const decreaseQuantity = useCallback((id: string) => {
    setItems((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) =>
      current.filter((item) => item.id !== id)
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearCart,
        cartCount,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider. " +
      "Wrap your application with CartProvider in app/layout.tsx."
    );
  }

  return context;
}
