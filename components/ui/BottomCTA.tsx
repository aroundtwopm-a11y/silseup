"use client";

import { Button } from "./Button";

// design.md 4장 BottomCTA: Layout(single, double, price) · Amount · AmountLabel
// single·double: 390 × 97, 상단 12 · 좌우 16 · 하단 32 / price: 390 × 139, 상단 16 · 좌우 16 · 하단 32
// double 버튼 간격 8, price 금액 행과 버튼 간격 12, 버튼 높이 52(xl)
// 고정 배치와 동작(onClick)은 화면에서 연결한다.
export type BottomCTALayout = "single" | "double" | "price";

export type BottomCTAProps = {
  layout?: BottomCTALayout;
  amount?: string;
  amountLabel?: string;
  /** 내부 Primary Button의 Label */
  primaryLabel?: string;
  /** double의 Secondary Button Label */
  secondaryLabel?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  /** Primary 버튼을 실제 disabled로 렌더링 (State=Disabled 시각과 같이) */
  disabled?: boolean;
  className?: string;
};

export function BottomCTA({
  layout = "single",
  amount = "월 85,000원",
  amountLabel = "월 납부 금액",
  primaryLabel = "다음",
  secondaryLabel = "이전",
  onPrimaryClick,
  onSecondaryClick,
  disabled = false,
  className,
}: BottomCTAProps) {
  const primary = (
    <Button
      variant="Primary"
      size="xl"
      state={disabled ? "Disabled" : "Default"}
      disabled={disabled}
      label={primaryLabel}
      onClick={onPrimaryClick}
      data-testid="bottom-cta-primary"
      className={layout === "double" ? "min-w-0 flex-1" : "w-full"}
    />
  );

  if (layout === "price") {
    return (
      <div
        className={[
          "flex w-full flex-col gap-12 border-t border-border-subtle bg-bg-surface px-16 pt-16 pb-32",
          className ?? "",
        ].join(" ")}
      >
        <div className="flex w-full items-center justify-between gap-8">
          <span className="text-body-small leading-21 font-medium text-text-secondary">{amountLabel}</span>
          <span className="text-subtitle leading-26 font-bold text-text-primary">{amount}</span>
        </div>
        {primary}
      </div>
    );
  }

  return (
    <div
      className={[
        "flex w-full gap-8 border-t border-border-subtle bg-bg-surface px-16 pt-12 pb-32",
        className ?? "",
      ].join(" ")}
    >
      {layout === "double" ? (
        <Button
          variant="Secondary"
          size="xl"
          label={secondaryLabel}
          onClick={onSecondaryClick}
          className="min-w-0 flex-1"
        />
      ) : null}
      {primary}
    </div>
  );
}

export default BottomCTA;
