import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "اتصل بنا",
  description:
    "تواصلي مع رونق من الدار البيضاء: واتساب، البريد، أو رسالة. كنأكدو الطلب بالهاتف، والتوصيل مجاني لجميع مدن المغرب.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
