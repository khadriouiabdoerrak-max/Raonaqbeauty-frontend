"use client";

import { useCart } from "../context/CartContext";
import { products } from "../lib/products";

export default function CartDrawer() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    closeCart,
    openCheckout,
    cartTotal,
    replaceInCart,
  } = useCart();

  if (!isCartOpen) return null;

  const suggestTwoPack = () => {
    const single = cart.find((item) => item.quantity === 1);
    if (!single) return null;
    const product = products.find((p) => p.id === single.id);
    if (!product) return null;
    const save = product.price1 * 2 - product.price2;
    return { product, item: single, save };
  };

  const twoPack = cart.length > 0 ? suggestTwoPack() : null;

  return (
    <>
      <div
        className="fixed inset-0 z-[70] bg-[#1C1412]/45 transition-opacity"
        onClick={closeCart}
      />

      <div
        className="fixed top-0 right-0 z-[80] flex h-full w-full flex-col bg-white shadow-2xl sm:w-[400px]"
        dir="ltr"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        <div className="flex items-center justify-between border-b border-champagne/25 px-4 py-4">
          <div>
            <p className="text-[11px] font-medium tracking-[0.2em] text-champagne">RAONAQ</p>
            <h2 id="cart-title" className="text-lg font-semibold text-warm-black">
              Panier
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="rounded-xl bg-pearl-blush p-2 text-warm-black/50 transition-colors hover:text-warm-black"
            aria-label="Fermer le panier"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-warm-black/45">
              <p className="text-lg font-semibold text-warm-black/70">Votre panier est vide</p>
              <p className="text-sm font-medium">Choisissez un outil et revenez ici</p>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-champagne/20 bg-pearl-blush p-3"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-black text-warm-black">{item.name}</h3>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-warm-black/35 transition-colors hover:text-rosewood"
                        aria-label="Retirer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-xl border border-[#1C1412]/10 bg-white px-2 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-1 font-black text-warm-black/50"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-sm font-black">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-1 font-black text-warm-black/50"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-semibold text-rosewood">{item.price * item.quantity} Dhs</p>
                    </div>
                  </div>
                </div>
              ))}

              {twoPack && (
                <button
                  type="button"
                  onClick={() =>
                    replaceInCart({
                      id: twoPack.product.id,
                      name: `Raonaq ${twoPack.product.name}`,
                      price: twoPack.product.price2 / 2,
                      quantity: 2,
                      image: twoPack.item.image,
                    })
                  }
                  className="w-full rounded-xl border border-rosewood/25 bg-white px-4 py-3 text-left transition-colors hover:border-rosewood"
                >
                  <p className="text-sm font-semibold text-warm-black">
                    Passer au duo — économisez {twoPack.save} Dhs
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-warm-black/45">
                    Total {twoPack.product.price2} Dhs au lieu de {twoPack.product.price1 * 2}
                  </p>
                </button>
              )}
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-champagne/25 bg-white p-4">
            <p className="mb-3 text-center text-[11px] font-medium text-warm-black/50">
              Inspectez avant de payer · livraison gratuite
            </p>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-medium text-warm-black/55">Total</span>
              <span className="text-2xl font-semibold text-warm-black">{cartTotal} Dhs</span>
            </div>
            <button
              type="button"
              onClick={openCheckout}
              className="btn btn-primary btn-block btn-lg"
            >
              Commander — payer à la livraison
            </button>
          </div>
        )}
      </div>
    </>
  );
}
