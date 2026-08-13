type PixelWindow = Window & {
  fbq?: (
    command: string,
    eventName: string,
    params?: Record<string, unknown>,
    options?: { eventID?: string }
  ) => void;
  ttq?: {
    track: (event: string, params?: Record<string, unknown>) => void;
  };
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
};

function getPixelWindow(): PixelWindow | null {
  if (typeof window === "undefined") return null;
  return window as PixelWindow;
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

function valueOf(contents: PixelContent[]) {
  return contents.reduce((sum, c) => sum + c.price * c.quantity, 0);
}

export function trackViewContent(product: { id: string; name: string; price: number }) {
  const w = getPixelWindow();
  const contents: PixelContent[] = [{ id: product.id, name: product.name, price: product.price, quantity: 1 }];
  const value = product.price;

  w?.fbq?.("track", "ViewContent", {
    content_ids: contentIds(contents),
    content_name: product.name,
    content_type: "product",
    contents: fbContents(contents),
    currency: "MAD",
    value,
  });

  w?.ttq?.track("ViewContent", {
    contents: contents.map((c) => ({ content_id: c.id, content_name: c.name, quantity: 1, price: c.price })),
    content_type: "product",
    currency: "MAD",
    value,
  });

  w?.snaptr?.("track", "VIEW_CONTENT", {
    item_ids: contentIds(contents),
    currency: "MAD",
    price: value,
  });
}

export function trackAddToCart(item: PixelContent) {
  const w = getPixelWindow();
  const contents = [item];
  const value = item.price * item.quantity;

  w?.fbq?.("track", "AddToCart", {
    content_ids: contentIds(contents),
    content_name: item.name,
    content_type: "product",
    contents: fbContents(contents),
    currency: "MAD",
    value,
  });

  w?.ttq?.track("AddToCart", {
    contents: [{ content_id: item.id, content_name: item.name, quantity: item.quantity, price: item.price }],
    content_type: "product",
    currency: "MAD",
    value,
  });

  w?.snaptr?.("track", "ADD_CART", {
    item_ids: [item.id],
    currency: "MAD",
    price: value,
  });
}

export function trackInitiateCheckout(contents: PixelContent[], total: number) {
  const w = getPixelWindow();

  w?.fbq?.("track", "InitiateCheckout", {
    content_ids: contentIds(contents),
    content_type: "product",
    contents: fbContents(contents),
    currency: "MAD",
    value: total,
    num_items: contents.reduce((n, c) => n + c.quantity, 0),
  });

  w?.ttq?.track("InitiateCheckout", {
    contents: contents.map((c) => ({
      content_id: c.id,
      content_name: c.name,
      quantity: c.quantity,
      price: c.price,
    })),
    content_type: "product",
    currency: "MAD",
    value: total,
  });

  w?.snaptr?.("track", "START_CHECKOUT", {
    item_ids: contentIds(contents),
    currency: "MAD",
    price: total,
  });
}

export function trackPurchase(params: {
  orderId: string | number;
  value: number;
  contents: PixelContent[];
  eventId?: string;
}) {
  const w = getPixelWindow();
  const eventId = params.eventId || `order_${params.orderId}`;
  const { value, contents } = params;

  w?.fbq?.(
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
    { eventID: eventId }
  );

  w?.ttq?.track("PlaceAnOrder", {
    contents: contents.map((c) => ({
      content_id: c.id,
      content_name: c.name,
      quantity: c.quantity,
      price: c.price,
    })),
    content_type: "product",
    currency: "MAD",
    event_id: eventId,
    value,
  });

  w?.snaptr?.("track", "PURCHASE", {
    client_dedup_id: eventId,
    item_ids: contentIds(contents),
    currency: "MAD",
    price: value,
    transaction_id: String(params.orderId),
  });
}

export { valueOf };
