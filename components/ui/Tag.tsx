import type { ReactNode } from "react";

// design.md 4장 Tag: 48 × 26, 반경 999, 상하 4 · 좌우 12, caption/bold, 배경 border/subtle, 글자 text/secondary
// 변형·공개 속성 없음. 기본 내용 "추천"
export function Tag({ children = "추천", className }: { children?: ReactNode; className?: string }) {
  return (
    <span
      className={[
        "inline-flex h-26 shrink-0 items-center whitespace-nowrap rounded-999 px-12 py-4 bg-border-subtle text-text-secondary text-caption leading-18 font-bold",
        className ?? "",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export default Tag;
