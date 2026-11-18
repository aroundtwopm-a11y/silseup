"use client";

import { Button } from "./Button";
import { Chip } from "./Chip";
import { Tag } from "./Tag";

// design.md 4장 Card/Plan: State(default, selected) · Name · Desc · Discount · Price · Original · Badge · Promo · Sale
// 너비 358(부모 너비), 패딩 20, 내부 간격 8, 반경 16, bg/surface
// default 테두리 border/default 1 · selected 테두리 border/medium 1.5
// 이름·가격·할인율 subtitle/bold, 설명 body/small-medium, 정가 caption/medium
export type CardPlanState = "default" | "selected";

export type CardPlanProps = {
  state?: CardPlanState;
  name?: string;
  desc?: string;
  discount?: string;
  price?: string;
  original?: string;
  /** 배지(Tag) 표시 여부 */
  badge?: boolean;
  /** 프로모션 Chip 표시 여부 */
  promo?: boolean;
  /** 할인율·정가 표시 여부 */
  sale?: boolean;
  /** 프로모션 Chip 문구 (내부 텍스트 오버라이드) */
  promoLabel?: string;
  /** 내부 Button Label. 지정하지 않으면 selected는 "선택됨" */
  buttonLabel?: string;
  onClick?: () => void;
  className?: string;
};

export function CardPlan({
  state = "default",
  name = "넉넉 무제한",
  desc = "데이터 무제한 · 통화 무제한 · 넷플릭스 포함",
  discount = "15%",
  price = "월 85,000원",
  original = "월 100,000원",
  badge = true,
  promo = true,
  sale = true,
  promoLabel,
  buttonLabel,
  onClick,
  className,
}: CardPlanProps) {
  const selected = state === "selected";
  return (
    <article
      data-testid="plan-card"
      aria-current={selected ? "true" : undefined}
      className={[
        "flex w-full flex-col gap-8 rounded-16 bg-bg-surface p-20",
        selected ? "border-1.5 border-border-medium" : "border border-border-default",
        className ?? "",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-8">
        <h3 className="text-subtitle leading-26 font-bold text-text-primary">{name}</h3>
        {badge ? <Tag /> : null}
      </div>
      <p className="text-body-small leading-21 font-medium text-text-secondary">{desc}</p>
      {promo && promoLabel ? (
        <div className="flex">
          <Chip type="sale">{promoLabel}</Chip>
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-8">
        {sale ? <span className="text-subtitle leading-26 font-bold text-text-accent">{discount}</span> : null}
        <span className="text-subtitle leading-26 font-bold text-text-primary">{price}</span>
        {sale ? <span className="text-caption leading-18 font-medium text-text-tertiary line-through">{original}</span> : null}
      </div>
      <Button
        variant={selected ? "Primary" : "Secondary"}
        size="lg"
        label={buttonLabel ?? (selected ? "선택됨" : "선택하기")}
        onClick={onClick}
        className="w-full"
      />
    </article>
  );
}

export default CardPlan;
