"use client";

import type { ButtonHTMLAttributes } from "react";

// design.md 4장 Button: Type(Primary, Secondary) · Size(sm, lg, xl) · State(Default, Hover, Disabled) · Label
export type ButtonVariant = "Primary" | "Secondary";
export type ButtonSize = "sm" | "lg" | "xl";
export type ButtonState = "Default" | "Hover" | "Disabled";

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  /** design.md의 Type 속성 (HTML type과 구분하려고 variant로 받는다) */
  variant?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  label?: string;
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-40 px-24 py-8",
  lg: "h-48 px-24 py-12",
  xl: "h-52 px-24 py-16",
};

const LOOK: Record<ButtonVariant, Record<"Default" | "Hover", string>> = {
  Primary: {
    Default: "bg-fill-primary text-text-on-dark border-0 hover:bg-fill-primary-hover",
    Hover: "bg-fill-primary-hover text-text-on-dark border-0",
  },
  Secondary: {
    Default: "bg-surface-default text-text-primary border border-border-default hover:bg-bg-subtle",
    Hover: "bg-bg-subtle text-text-primary border border-border-default",
  },
};

export function Button({
  variant = "Primary",
  size = "xl",
  state = "Default",
  label = "로그인",
  disabled,
  type = "button",
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = Boolean(disabled) || state === "Disabled";
  // Secondary sm Default·Hover는 실제 외곽 높이 42
  const sizeClass = variant === "Secondary" && size === "sm" && !isDisabled ? "h-42 px-24 py-8" : SIZE[size];
  const look = isDisabled
    ? "bg-fill-disabled text-text-on-dark border-0 cursor-not-allowed"
    : LOOK[variant][state === "Hover" ? "Hover" : "Default"];
  const text =
    isDisabled && variant === "Primary"
      ? "text-body leading-24 font-medium"
      : "text-body leading-24 font-semibold";

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center rounded-8 whitespace-nowrap",
        sizeClass,
        look,
        text,
        className ?? "",
      ].join(" ")}
      {...rest}
    >
      {label}
    </button>
  );
}

export default Button;
