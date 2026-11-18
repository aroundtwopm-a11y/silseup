"use client";

import type { InputHTMLAttributes } from "react";

// design.md 4장 Input: State(default, focus, filled, caution, disabled) · errorMessage(Boolean)
// 필드 358 × 58, 필드와 메시지 간격 12, 모서리 0, 하단 선 중심 표현
export type InputState = "default" | "focus" | "filled" | "caution" | "disabled";

export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  /** 지정하지 않으면 disabled → disabled, 값 있음 → filled, 그 외 → default */
  state?: InputState;
  /** default·focus·filled 상태의 메시지 표시 여부 (caution은 항상 표시) */
  errorMessage?: boolean;
  /** 메시지 문구 (design.md: 내부 텍스트 오버라이드) */
  message?: string;
  className?: string;
};

const LINE: Record<InputState, string> = {
  default: "border-border-default focus-within:border-border-focus",
  focus: "border-border-focus",
  filled: "border-border-default focus-within:border-border-focus",
  caution: "border-border-error",
  disabled: "border-border-default bg-bg-subtle",
};

export function Input({ state, errorMessage = false, message, className, disabled, value, defaultValue, ...rest }: InputProps) {
  const hasValue = value !== undefined ? String(value).length > 0 : defaultValue !== undefined && String(defaultValue).length > 0;
  const s: InputState = state ?? (disabled ? "disabled" : hasValue ? "filled" : "default");
  const isDisabled = Boolean(disabled) || s === "disabled";
  const showMessage = Boolean(message) && (s === "caution" || (s !== "disabled" && errorMessage));
  const valueText = isDisabled ? "text-text-on-disabled" : "text-text-primary";
  // default 상태의 메시지는 heading/h4, 그 외 상태는 body/small-medium
  const messageText =
    s === "caution"
      ? "text-body-small leading-21 font-medium text-text-error"
      : s === "default"
        ? "text-heading-h4 leading-28 font-bold text-text-secondary"
        : "text-body-small leading-21 font-medium text-text-secondary";

  return (
    <div className={["flex w-full flex-col gap-12", className ?? ""].join(" ")}>
      <div className={["flex h-58 w-full items-center gap-8 rounded-0 border-b px-4", LINE[s]].join(" ")}>
        <input
          disabled={isDisabled}
          value={value}
          defaultValue={defaultValue}
          aria-invalid={s === "caution" ? true : undefined}
          className={[
            "min-w-0 flex-1 bg-transparent outline-none text-body leading-24 font-semibold placeholder:text-text-placeholder",
            valueText,
          ].join(" ")}
          {...rest}
        />
        {s === "caution" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="size-24 shrink-0 text-icon-error"
          >
            <circle cx="12" cy="12" r="10" />
            <rect x="11" y="6" width="2" height="8" className="fill-icon-on-dark" />
            <rect x="11" y="16" width="2" height="2" className="fill-icon-on-dark" />
          </svg>
        ) : null}
      </div>
      {showMessage ? <p className={messageText}>{message}</p> : null}
    </div>
  );
}

export default Input;
