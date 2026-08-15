const SCORE = 4.8;
const YELLOW = "#E8C547";
const STAR_PATH =
  "M10 1.6 12.2 7l5.8.5-4.4 3.8 1.4 5.7L10 14.2 4.99 17l1.4-5.7L2 7.5 7.8 7 10 1.6Z";

type Props = {
  className?: string;
};

export default function Stars({ className = "" }: Props) {
  return (
    <span
      className={`inline-flex flex-nowrap items-center gap-1.5 whitespace-nowrap ${className}`}
      aria-label={`Note ${SCORE} sur 5`}
    >
      <span className="inline-flex flex-nowrap items-center gap-px">
        {Array.from({ length: 5 }, (_, i) => {
          const fill = Math.min(1, Math.max(0, SCORE - i));
          return (
            <svg key={i} viewBox="0 0 20 20" className="h-3.5 w-3.5 shrink-0 md:h-4 md:w-4" aria-hidden>
              <path fill="#E8C54733" d={STAR_PATH} />
              {fill > 0 && (
                <path
                  fill={YELLOW}
                  d={STAR_PATH}
                  style={{ clipPath: `inset(0 ${Math.round((1 - fill) * 100)}% 0 0)` }}
                />
              )}
            </svg>
          );
        })}
      </span>
      <span className="font-display text-[13px] font-semibold leading-none text-[#1C1412]/70 md:text-sm">
        ({SCORE.toFixed(1)})
      </span>
    </span>
  );
}
