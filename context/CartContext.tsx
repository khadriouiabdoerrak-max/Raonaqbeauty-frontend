"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { products, productIsAvailable } from "../lib/products";
import { trackAddToCart } from "../lib/pixels";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  replaceInCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  backToCart: () => void;
  closeOverlays: () => void;
  finishOrder: () => void;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const POST_ORDER_ROUTES = new Set(["/thank-you", "/upsell"]);

export function CartProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);

  const closeOverlays = useCallback(() => {
    setCartOpen(false);
    setCheckoutOpen(false);
  }, []);

  const openCart = useCallback(() => {
    if (POST_ORDER_ROUTES.has(pathname)) return;
    setCheckoutOpen(false);
    setCartOpen(true);
  }, [pathname]);

  const closeCart = useCallback(() => {
    setCartOpen(false);
  }, []);

  const openCheckout = useCallback(() => {
    setCartOpen(false);
    setCheckoutOpen(true);
  }, []);

  const closeCheckout = useCallback(() => {
    setCheckoutOpen(false);
  }, []);

  const backToCart = useCallback(() => {
    setCheckoutOpen(false);
    setCartOpen(true);
  }, []);

  const setIsCartOpen = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        if (POST_ORDER_ROUTES.has(pathname)) return;
        setCheckoutOpen(false);
        setCartOpen(true);
        return;
      }
      setCartOpen(false);
    },
    [pathname]
  );

  const clearCart = useCallback(() => setCart([]), []);

  const finishOrder = useCallback(() => {
    setCartOpen(false);
    setCheckoutOpen(false);
    setCart([]);
  }, []);

  useEffect(() => {
    if (!POST_ORDER_ROUTES.has(pathname)) return;
    setCartOpen(false);
    setCheckoutOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isCartOpen && !isCheckoutOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isCartOpen, isCheckoutOpen]);

  const addToCart = useCallback((item: CartItem) => {
    const catalog = products.find((p) => p.id === item.id);
    if (catalog && !productIsAvailable(catalog)) return;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
    trackAddToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    });
    setCheckoutOpen(false);
    setCartOpen(true);
  }, []);

  const replaceInCart = useCallback((item: CartItem) => {
    setCart((prev) => [...prev.filter((i) => i.id !== item.id), item]);
    setCheckoutOpen(false);
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, []);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      replaceInCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      isCheckoutOpen,
      setIsCartOpen,
      openCart,
      closeCart,
      openCheckout,
      closeCheckout,
      backToCart,
      closeOverlays,
      finishOrder,
      cartTotal,
    }),
    [
      cart,
      addToCart,
      replaceInCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isCartOpen,
      isCheckoutOpen,
      setIsCartOpen,
      openCart,
      closeCart,
      openCheckout,
      closeCheckout,
      backToCart,
      closeOverlays,
      finishOrder,
      cartTotal,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
