"use client";

import type { ButtonHTMLAttributes } from "react";

// design.md 4장 Checkbox: State(default, active). 외곽 24 × 24, 내부 도형 20 × 20
// 라벨 속성·Disabled 변형 없음. 체크 전환은 onChange로 화면에서 연결한다.
export type CheckboxState = "default" | "active";

export type CheckboxProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "children"> & {
  state?: CheckboxState;
  /** 눌렀을 때 바뀔 다음 선택 여부 */
  onChange?: (checked: boolean) => void;
};

export function Checkbox({ state = "default", onChange, onClick, className, type = "button", ...rest }: CheckboxProps) {
  const checked = state === "active";
  return (
    <button
      type={type}
      role="checkbox"
      aria-checked={checked}
      onClick={(e) => {
        onClick?.(e);
        onChange?.(!checked);
      }}
      className={["inline-flex size-24 shrink-0 items-center justify-center", className ?? ""].join(" ")}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={[
          "inline-flex size-20 items-center justify-center rounded-4",
          checked ? "bg-fill-primary text-icon-on-dark border-0" : "bg-bg-surface border border-border-default",
        ].join(" ")}
      >
        {checked ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-16"
          >
            <path d="M5 12L10 17L19 7" />
          </svg>
        ) : null}
      </span>
    </button>
  );
}

export default Checkbox;
