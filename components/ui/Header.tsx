"use client";

import { ArrowLeft } from "./ArrowLeft";
import { Logo } from "./Logo";

// design.md 4장 Header: Type(default, root) · Title. 390 × 56, 좌우 16, bg/surface
// 뒤로가기 동작은 onBack으로 화면에서 연결한다 (컴포넌트 안에서 이동하지 않음).
export type HeaderType = "default" | "root";

export type HeaderProps = {
  type?: HeaderType;
  title?: string;
  onBack?: () => void;
  className?: string;
};

export function Header({ type = "default", title = "맞춤 요금제 추천", onBack, className }: HeaderProps) {
  if (type === "root") {
    return (
      <header
        className={[
          "flex h-56 w-full items-center justify-between rounded-0 px-16 bg-bg-surface",
          className ?? "",
        ].join(" ")}
      >
        <h1 className="text-heading-h4 leading-28 font-bold text-text-primary">{title}</h1>
        <Logo />
      </header>
    );
  }
  return (
    <header
      className={[
        "flex h-56 w-full items-center justify-between gap-8 rounded-0 px-16 bg-bg-surface",
        className ?? "",
      ].join(" ")}
    >
      <button type="button" aria-label="뒤로 가기" onClick={onBack} className="inline-flex size-24 shrink-0 items-center justify-center">
        <ArrowLeft />
      </button>
      <h1 className="min-w-0 flex-1 truncate text-center text-subtitle leading-26 font-semibold text-text-primary">{title}</h1>
      <span aria-hidden="true" className="size-24 shrink-0" />
    </header>
  );
}

export default Header;
