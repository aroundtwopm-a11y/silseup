// design.md 4장 icon/doneMark: 64 × 64, fill/primary 배경 + icon/on-dark 체크, 모서리 9999
export function DoneMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "inline-flex size-64 shrink-0 items-center justify-center rounded-full bg-fill-primary text-icon-on-dark",
        className ?? "",
      ].join(" ")}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-32"
      >
        <path d="M5 12L10 17L19 7" />
      </svg>
    </span>
  );
}

export default DoneMark;
