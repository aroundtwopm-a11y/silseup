"use client";

// design.md 4장 FilterChip: State(default, selected) · Label
// 높이 40, 상하 8 · 좌우 16, 반경 9999, 너비는 라벨에 따름
// default: bg/surface + border/default + body/small-medium / selected: fill/secondary + text/on-dark + body/small-strong
export type FilterChipState = "default" | "selected";

export type FilterChipProps = {
  state?: FilterChipState;
  label?: string;
  onClick?: () => void;
  className?: string;
};

export function FilterChip({ state = "default", label = "데이터 많이", onClick, className }: FilterChipProps) {
  const selected = state === "selected";
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={[
        "inline-flex h-40 shrink-0 items-center justify-center whitespace-nowrap rounded-full px-16 py-8",
        selected
          ? "bg-fill-secondary border border-fill-secondary text-text-on-dark text-body-small leading-21 font-semibold"
          : "bg-bg-surface border border-border-default text-text-primary text-body-small leading-21 font-medium",
        className ?? "",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

export default FilterChip;
