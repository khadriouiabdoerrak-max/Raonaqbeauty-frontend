"use client";

import { PDP_TRUST_STRIP } from "../lib/products";
import { useVisible } from "../lib/useVisible";

function TrustIcon({ id }: { id: (typeof PDP_TRUST_STRIP)[number]["id"] }) {
  const common = {
    className: "h-5 w-5 shrink-0 text-[#C45B6A]",
    fill: "none" as const,
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: 1.5,
    "aria-hidden": true as const,
  };

  switch (id) {
    case "ship":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5h11.25v9H3v-9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 10.5H18l2.25 3v3h-5.25v-6z" />
          <circle cx="7.5" cy="18" r="1.5" />
          <circle cx="17.25" cy="18" r="1.5" />
        </svg>
      );
    case "cod":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12z"
          />
          <circle cx="12" cy="12" r="2.25" />
        </svg>
      );
    case "swap":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 3.75l3 3-3 3M19.5 6.75H8.25a4.5 4.5 0 000 9H9M7.5 20.25l-3-3 3-3M4.5 17.25h11.25a4.5 4.5 0 000-9H15"
          />
        </svg>
      );
    case "return":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
          />
        </svg>
      );
    case "heat":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v7.5a3 3 0 11-2.12 5.12A3 3 0 0112 10.5V3z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 19.5h5" />
        </svg>
      );
    case "support":
      return (
        <svg {...common}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 9.75h7.5M8.25 13.5h4.5M4.5 19.5l2.1-2.1A2.25 2.25 0 018.19 16.5H18a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0018 4.5H6A2.25 2.25 0 003.75 6.75v10.5A2.25 2.25 0 006 19.5h2.25z"
          />
        </svg>
      );
    default:
      return null;
  }
}

function TrustChip({ item }: { item: (typeof PDP_TRUST_STRIP)[number] }) {
  return (
    <div className="flex shrink-0 items-center gap-3 px-5">
      <TrustIcon id={item.id} />
      <div className="text-left">
        <p className="whitespace-nowrap text-[13px] font-semibold leading-snug text-[#1C1412]">
          {item.label}
        </p>
        <p className="whitespace-nowrap text-[11px] leading-snug text-[#1C1412]/45">{item.detail}</p>
      </div>
      <span className="ml-2 h-1 w-1 shrink-0 rounded-full bg-[#C4A484]/70" aria-hidden />
    </div>
  );
}

/** Bandeau confiance — marquee فقط لما ظاهر (أداء السكرول) */
export default function PdpTrustStrip() {
  const { ref, visible } = useVisible();
  const loop = [...PDP_TRUST_STRIP, ...PDP_TRUST_STRIP];

  return (
    <section
      ref={ref}
      className="cv-auto border-y border-[#1C1412]/8 bg-white"
      aria-label="Engagements Raonaq"
    >
      <div className="overflow-hidden py-5">
        <div
          className={`raonaq-trust-track flex w-max items-center ${visible ? "" : "raonaq-anim-paused"}`}
        >
          {loop.map((item, i) => (
            <TrustChip key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
