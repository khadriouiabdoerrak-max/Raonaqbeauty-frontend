import type { CartItem } from "../context/CartContext";
import { fetchWithTimeout } from "./apiBase";
import type { LastPurchase, PixelContent } from "./pixels";

export type OrderCustomer = {
  name: string;
  phone: string;
  city: string;
  address: string;
};

export type CreateOrderInput = OrderCustomer & {
  cart: CartItem[];
  total: number;
  acceptedUpsell?: boolean;
};

export type CreatedOrder = {
  orderId: number;
  eventId: string;
  total: number;
  contents: PixelContent[];
};

export type PendingOrder = OrderCustomer & {
  cart: CartItem[];
  total: number;
  orderId: number;
  eventId: string;
};

const PENDING_KEY = "raonaq_pending_order";
const API_HOST = "https://api.raonaqbeauty.com";

function makeEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `order_${Date.now()}`;
}

function contentsFromCart(cart: CartItem[]): PixelContent[] {
  return cart.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));
}

export function savePendingOrder(data: PendingOrder) {
  localStorage.setItem(PENDING_KEY, JSON.stringify(data));
}

export function readPendingOrder(): PendingOrder | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingOrder;
  } catch {
    return null;
  }
}

export function clearPendingOrder() {
  localStorage.removeItem(PENDING_KEY);
  localStorage.removeItem("temp_customer_data");
}

export function toLastPurchase(data: {
  orderId: number;
  eventId: string;
  total: number;
  contents: PixelContent[];
  customer: OrderCustomer;
}): LastPurchase {
  return {
    orderId: data.orderId,
    eventId: data.eventId,
    value: data.total,
    contents: data.contents,
    customer: data.customer,
  };
}

const LAST_ORDER_KEY = "raonaq_last_order";

export function saveLastOrder(purchase: LastPurchase) {
  try {
    sessionStorage.setItem("last_purchase", JSON.stringify(purchase));
    localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(purchase));
  } catch {
    // ignore quota / private mode
  }
}

export function readLastOrder(): LastPurchase | null {
  if (typeof window === "undefined") return null;
  try {
    const session = sessionStorage.getItem("last_purchase");
    if (session) return JSON.parse(session) as LastPurchase;
    const stored = localStorage.getItem(LAST_ORDER_KEY);
    if (stored) return JSON.parse(stored) as LastPurchase;
  } catch {
    // ignore
  }
  return null;
}

export function consumePurchaseForTracking(): LastPurchase | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("last_purchase");
    if (!raw) return null;
    sessionStorage.removeItem("last_purchase");
    return JSON.parse(raw) as LastPurchase;
  } catch {
    return null;
  }
}

/** تسجيل الطلب مباشرة فالـ API (Postgres / pgweb) */
export async function createOrder(input: CreateOrderInput): Promise<CreatedOrder> {
  const eventId = makeEventId();
  const contents = contentsFromCart(input.cart);

  const payload = {
    customer_name: input.name,
    customer_phone: input.phone,
    customer_city: input.city,
    customer_address: input.address,
    total_price: input.total,
    accepted_upsell: Boolean(input.acceptedUpsell),
    event_id: eventId,
    items: input.cart.map((item) => ({
      product_name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
  };

  const order = await postDirect<{ id: number }>(
    `${API_HOST}/api/v1/orders/webhook`,
    payload
  );

  if (!order?.id) {
    throw new Error("no_order_id");
  }

  return {
    orderId: order.id,
    eventId,
    total: input.total,
    contents,
  };
}

export async function attachUpsell(
  orderId: number,
  upsell: {
    id: string;
    name: string;
    price: number;
  }
): Promise<void> {
  await postDirect(`${API_HOST}/api/v1/orders/${orderId}/upsell`, {
    product_name: upsell.name,
    quantity: 1,
    price: upsell.price,
  });
}

async function postDirect<T>(url: string, payload: unknown): Promise<T> {
  let lastError: unknown = "request_failed";

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const res = await fetchWithTimeout(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        mode: "cors",
      });
      const text = await res.text();
      if (!res.ok) {
        lastError = text || res.status;
        if (res.status >= 400 && res.status < 500 && res.status !== 429) {
          break;
        }
        continue;
      }
      return JSON.parse(text) as T;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}
