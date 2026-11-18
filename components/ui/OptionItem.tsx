"use client";

// design.md 4장 OptionItem: State(default, selected) · Title · Desc
// 358 너비, 상하 16 · 좌우 20, 텍스트와 라디오 간격 12, 반경 12, 라디오 22 × 22
// default: bg/surface + border/default / selected: bg/default + border/medium 1.5 + fill/primary 라디오
// 제목: default body/strong → selected subtitle/bold
export type OptionItemState = "default" | "selected";

export type OptionItemProps = {
  state?: OptionItemState;
  title?: string;
  desc?: string;
  onClick?: () => void;
  className?: string;
};

export function OptionItem({
  state = "default",
  title = "데이터를 많이 써요",
  desc = "영상·게임을 자주 봐서 무제한이 필요해요",
  onClick,
  className,
}: OptionItemProps) {
  const selected = state === "selected";
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={[
        "flex w-full items-center justify-between gap-12 rounded-12 px-20 py-16 text-left",
        selected ? "bg-bg-default border-1.5 border-border-medium" : "bg-bg-surface border border-border-default",
        className ?? "",
      ].join(" ")}
    >
      <span className="flex min-w-0 flex-1 flex-col gap-4">
        <span
          className={
            selected
              ? "text-subtitle leading-26 font-bold text-text-primary"
              : "text-body leading-24 font-semibold text-text-primary"
          }
        >
          {title}
        </span>
        <span className="text-body-small leading-21 font-medium text-text-secondary">{desc}</span>
      </span>
      <span
        aria-hidden="true"
        className={[
          "inline-flex size-22 shrink-0 items-center justify-center rounded-full",
          selected ? "bg-fill-primary border-0" : "bg-bg-surface border border-border-default",
        ].join(" ")}
      >
        {selected ? <span className="size-8 rounded-full bg-icon-on-dark" /> : null}
      </span>
    </button>
  );
}

export default OptionItem;
