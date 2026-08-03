import type { CartItem } from "../context/CartContext";
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
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://Api.raonaqbeauty.com";

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
}): LastPurchase {
  return {
    orderId: data.orderId,
    eventId: data.eventId,
    value: data.total,
    contents: data.contents,
  };
}

/** تسجيل الطلب فوراً بعد تأكيد الفورم */
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

  const res = await fetch(`${API_URL}/api/v1/orders/webhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const details = await res.text();
    throw new Error(details || "فشل إرسال الطلب");
  }

  const order = (await res.json()) as { id: number };
  return {
    orderId: order.id,
    eventId,
    total: input.total,
    contents,
  };
}

/** إضافة العرض الإضافي لطلب موجود */
export async function attachUpsell(orderId: number, upsell: {
  id: string;
  name: string;
  price: number;
}): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/orders/${orderId}/upsell`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      product_name: upsell.name,
      quantity: 1,
      price: upsell.price,
      product_id: upsell.id,
    }),
  });

  if (!res.ok) {
    const details = await res.text();
    throw new Error(details || "فشل إضافة العرض");
  }
}
