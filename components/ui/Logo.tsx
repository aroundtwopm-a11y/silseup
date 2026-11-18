// design.md 4장 Logo: 32 × 24, brand/primary. 변형·공개 속성 없음
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 24"
      fill="currentColor"
      role="img"
      aria-label="로고"
      className={["w-32 h-24 shrink-0 text-brand-primary", className ?? ""].join(" ")}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="24" cy="12" r="6" />
    </svg>
  );
}

export default Logo;
