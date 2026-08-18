"use client";

import dynamic from "next/dynamic";

const CartDrawer = dynamic(() => import("./CartDrawer"), { ssr: false });
const CheckoutModal = dynamic(() => import("./CheckoutModal"), { ssr: false });

/** Charge le panier / checkout après le HTML critique — allège le JS initial. */
export default function CartChrome() {
  return (
    <>
      <CartDrawer />
      <CheckoutModal />
    </>
  );
}
