type Props = {
  amount: number;
  was?: number;
  size?: "sm" | "lg";
};

export default function Price({ amount, was, size = "sm" }: Props) {
  const now = size === "lg" ? "text-4xl md:text-[2.6rem]" : "text-lg";
  const old = size === "lg" ? "text-base md:text-lg" : "text-sm";

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
      <span className={`${now} font-semibold leading-none text-[#C45B6A]`}>
        {amount}
        <span className="ml-1.5 text-[0.55em] font-medium">Dhs</span>
      </span>
      {was != null && was > amount && (
        <span className={`font-display italic leading-none text-[#1C1412]/35 line-through ${old}`}>
          {was} Dhs
        </span>
      )}
    </span>
  );
}
