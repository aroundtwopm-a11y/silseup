// design.md 4장 List/Row: Type(default, check) · Label · Value
// 358 × 46, 상하 12 · 좌우 4, 내부 간격 12, 구분선 border/subtle
// check: 선행 6 × 6 원형 점(icon/accent), 값 text/accent
export type ListRowType = "default" | "check";

export type ListRowProps = {
  type?: ListRowType;
  label?: string;
  value?: string;
  className?: string;
};

export function ListRow({ type = "default", label = "데이터", value = "무제한", className }: ListRowProps) {
  const isCheck = type === "check";
  return (
    <div
      className={[
        "flex w-full items-center justify-between gap-12 border-b border-border-subtle px-4 py-12",
        className ?? "",
      ].join(" ")}
    >
      <span className="flex min-w-0 items-center gap-12">
        {isCheck ? <span aria-hidden="true" className="size-6 shrink-0 rounded-full bg-icon-accent" /> : null}
        <span className="text-body-small leading-21 font-medium text-text-secondary">{label}</span>
      </span>
      <span
        className={[
          "text-right text-body-small leading-21 font-semibold",
          isCheck ? "text-text-accent" : "text-text-primary",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}

export default ListRow;
