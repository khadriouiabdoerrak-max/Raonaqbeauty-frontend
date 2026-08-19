type Fbq = (
  command: string,
  eventName: string,
  params?: Record<string, unknown>,
  options?: { eventID?: string }
) => void;

type Ttq = {
  track: (event: string, params?: Record<string, unknown>) => void;
  page?: () => void;
};

type PixelWindow = Window & {
  fbq?: Fbq;
  ttq?: Ttq;
  snaptr?: (command: string, eventName: string, params?: Record<string, unknown>) => void;
};

export type PixelContent = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type LastPurchase = {
  orderId: number;
  value: number;
  eventId: string;
  contents: PixelContent[];
  customer?: {
    name: string;
    phone: string;
    city: string;
    address: string;
  };
};

function getPixelWindow(): PixelWindow | null {
  if (typeof window === "undefined") return null;
  return window as PixelWindow;
}

/** Retry until the pixel stub exists (script may load after /api/pixels). */
function whenFb(run: (fbq: Fbq) => void) {
  const w = getPixelWindow();
  if (!w) return;
  let n = 0;
  const tick = () => {
    if (typeof w.fbq === "function") {
      run(w.fbq);
      return;
    }
    if (++n > 50) return;
    window.setTimeout(tick, 100);
  };
  tick();
}

function whenTt(run: (ttq: Ttq) => void) {
  const w = getPixelWindow();
  if (!w) return;
  let n = 0;
  const tick = () => {
    if (w.ttq && typeof w.ttq.track === "function") {
      run(w.ttq);
      return;
    }
    if (++n > 50) return;
    window.setTimeout(tick, 100);
  };
  tick();
}

function whenSnap(run: (snaptr: NonNullable<PixelWindow["snaptr"]>) => void) {
  const w = getPixelWindow();
  if (!w) return;
  let n = 0;
  const tick = () => {
    if (typeof w.snaptr === "function") {
      run(w.snaptr);
      return;
    }
    if (++n > 50) return;
    window.setTimeout(tick, 100);
  };
  tick();
}

function contentIds(contents: PixelContent[]) {
  return contents.map((c) => c.id);
}

function fbContents(contents: PixelContent[]) {
  return contents.map((c) => ({
    id: c.id,
    quantity: c.quantity,
    item_price: c.price,
  }));
}

function ttContents(contents: PixelContent[]) {
  return contents.map((c) => ({
    content_id: c.id,
    content_name: c.name,
    quantity: c.quantity,
    price: c.price,
  }));
}

function valueOf(contents: PixelContent[]) {
  return contents.reduce((sum, c) => sum + c.price * c.quantity, 0);
}

export function trackViewContent(product: { id: string; name: string; price: number }) {
  const contents: PixelContent[] = [
    { id: product.id, name: product.name, price: product.price, quantity: 1 },
  ];
  const value = product.price;

  whenFb((fbq) => {
    fbq("track", "ViewContent", {
      content_ids: contentIds(contents),
      content_name: product.name,
      content_type: "product",
      contents: fbContents(contents),
      currency: "MAD",
      value,
    });
  });

  whenTt((ttq) => {
    ttq.track("ViewContent", {
      contents: ttContents(contents),
      content_type: "product",
      currency: "MAD",
      value,
    });
  });

  whenSnap((snaptr) => {
    snaptr("track", "VIEW_CONTENT", {
      item_ids: contentIds(contents),
      currency: "MAD",
      price: value,
    });
  });
}

export function trackAddToCart(item: PixelContent) {
  const contents = [item];
  const value = item.price * item.quantity;

  whenFb((fbq) => {
    fbq("track", "AddToCart", {
      content_ids: contentIds(contents),
      content_name: item.name,
      content_type: "product",
      contents: fbContents(contents),
      currency: "MAD",
      value,
    });
  });

  whenTt((ttq) => {
    ttq.track("AddToCart", {
      contents: ttContents(contents),
      content_type: "product",
      currency: "MAD",
      value,
    });
  });

  whenSnap((snaptr) => {
    snaptr("track", "ADD_CART", {
      item_ids: [item.id],
      currency: "MAD",
      price: value,
    });
  });
}

export function trackInitiateCheckout(contents: PixelContent[], total: number) {
  whenFb((fbq) => {
    fbq("track", "InitiateCheckout", {
      content_ids: contentIds(contents),
      content_type: "product",
      contents: fbContents(contents),
      currency: "MAD",
      value: total,
      num_items: contents.reduce((n, c) => n + c.quantity, 0),
    });
  });

  whenTt((ttq) => {
    ttq.track("InitiateCheckout", {
      contents: ttContents(contents),
      content_type: "product",
      currency: "MAD",
      value: total,
    });
  });

  whenSnap((snaptr) => {
    snaptr("track", "START_CHECKOUT", {
      item_ids: contentIds(contents),
      currency: "MAD",
      price: total,
    });
  });
}

export function trackPurchase(params: {
  orderId: string | number;
  value: number;
  contents: PixelContent[];
  eventId?: string;
}) {
  const eventId = params.eventId || `order_${params.orderId}`;
  const { value, contents } = params;
  const payload = {
    contents: ttContents(contents),
    content_type: "product",
    currency: "MAD",
    value,
    event_id: eventId,
  };

  whenFb((fbq) => {
    fbq(
      "track",
      "Purchase",
      {
        content_ids: contentIds(contents),
        content_type: "product",
        contents: fbContents(contents),
        currency: "MAD",
        value,
        order_id: String(params.orderId),
      },
      { eventID: eventId },
    );
  });

  whenTt((ttq) => {
    // COD Maroc: PlaceAnOrder = commande enregistrée (paiement à la porte)
    ttq.track("PlaceAnOrder", payload);
  });

  whenSnap((snaptr) => {
    snaptr("track", "PURCHASE", {
      client_dedup_id: eventId,
      item_ids: contentIds(contents),
      currency: "MAD",
      price: value,
      transaction_id: String(params.orderId),
    });
  });
}

export { valueOf };
