// design.md 4장 icon/arrowLeft: 24 × 24, icon/default. 변형·공개 속성 없음
export function ArrowLeft({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={["size-24 shrink-0 text-icon-default", className ?? ""].join(" ")}
    >
      <path d="M15 5L8 12L15 19" />
    </svg>
  );
}

export default ArrowLeft;
