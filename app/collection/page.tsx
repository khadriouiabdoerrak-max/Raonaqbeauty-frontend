"use client";

import Link from "next/link";
import { useCart } from "../../context/CartContext";
import { products } from "../../lib/products";

export default function CollectionPage() {
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-[#F7F1EC] py-14 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-[#1C1412] mb-3">جميع المنتجات</h1>
        <p className="text-gray-500 text-lg">مجموعة متكاملة لعناية الشعر الاحترافية</p>
        <div className="flex justify-center gap-2 mt-2 text-yellow-400 text-2xl">★★★★★</div>
        <p className="text-sm text-gray-400 mt-1">+1200 عميلة راضية في المغرب</p>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <div key={product.id} className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden">
              <div className={`grid md:grid-cols-2 ${index % 2 === 1 ? "md:[direction:ltr]" : ""}`}>
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-[#F7F1EC]">
                  {product.tag && (
                    <span className="absolute top-4 right-4 bg-[#C45B6A] text-white text-xs font-bold px-3 py-1.5 rounded-full z-10">
                      {product.tag}
                    </span>
                  )}
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                </div>

                {/* Details */}
                <div className="p-6 text-right flex flex-col justify-between" dir="rtl">
                  <div>
                    <div className="flex gap-0.5 text-yellow-400 mb-2">
                      {"★".repeat(product.stars)}
                      <span className="text-gray-400 text-sm mr-1">({product.reviewCount})</span>
                    </div>
                    <h2 className="font-black text-xl text-[#1C1412] mb-2 leading-snug">{product.name}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{product.tagline}</p>
                    <ul className="space-y-1 mb-4">
                      {product.features.slice(0, 3).map((f) => (
                        <li key={f} className="flex gap-2 items-center text-sm text-gray-600">
                          <span className="text-[#C45B6A]">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => addToCart({ id: product.id, name: product.name, price: product.price1, quantity: 1, image: product.images[0] })}
                      className="w-full flex justify-between items-center p-3 border-2 border-gray-200 rounded-xl hover:border-[#C45B6A] hover:bg-[#F7F1EC] transition-colors"
                    >
                      <span className="font-medium">قطعة واحدة</span>
                      <span className="font-bold text-[#C45B6A] text-lg">{product.price1} د.م</span>
                    </button>
                    <button
                      onClick={() => addToCart({ id: product.id, name: product.name, price: product.price2, quantity: 2, image: product.images[0] })}
                      className="w-full flex justify-between items-center p-3 bg-[#C4A484]/15 border-2 border-[#C4A484] rounded-xl hover:bg-[#C4A484]/25 transition-colors"
                    >
                      <span className="font-bold">قطعتين 🔥 وفري</span>
                      <span className="font-bold text-[#1C1412] text-lg">{product.price2} د.م</span>
                    </button>
                    <Link
                      href={`/products/${product.slug}`}
                      className="block text-center text-sm text-[#C45B6A] underline py-1"
                    >
                      عرض كامل التفاصيل والصور
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
