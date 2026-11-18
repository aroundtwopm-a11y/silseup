import type { ReactNode } from "react";

// design.md 4장 Chip: Type(benefit, package, sale). 선택 상태·Label 속성 없음 (문구는 내부 텍스트 오버라이드)
export type ChipType = "benefit" | "package" | "sale";

export type ChipProps = {
  type?: ChipType;
  children?: ReactNode;
  className?: string;
};

const LOOK: Record<ChipType, string> = {
  benefit: "h-20 px-6 rounded-4 bg-bg-subtle text-text-secondary text-caption-mini leading-14 font-semibold",
  package: "h-20 px-6 rounded-4 bg-fill-secondary text-text-on-dark text-caption-mini leading-14 font-semibold",
  sale: "h-24 px-10 rounded-6 bg-bg-accent-subtle text-icon-accent text-caption leading-18 font-bold",
};

export function Chip({ type = "sale", children, className }: ChipProps) {
  return (
    <span className={["inline-flex shrink-0 items-center whitespace-nowrap", LOOK[type], className ?? ""].join(" ")}>
      {children}
    </span>
  );
}

export default Chip;
