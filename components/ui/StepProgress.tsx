// design.md 4장 StepProgress: Step(1, 2, 3). 358 × 30, 라벨 caption/bold text/accent,
// 라벨과 트랙 간격 8, 트랙 높이 4 bg/subtle, 진행 막대 fill/primary. 총 3단계 기준
export type StepProgressStep = 1 | 2 | 3;

export type StepProgressProps = {
  step?: StepProgressStep;
  /** 라벨 문구 (내부 텍스트 오버라이드). 기본 "<step> / 3" */
  label?: string;
  className?: string;
};

const BAR: Record<StepProgressStep, string> = {
  1: "w-1/3",
  2: "w-2/3",
  3: "w-full",
};

export function StepProgress({ step = 1, label, className }: StepProgressProps) {
  return (
    <div className={["flex h-30 w-full flex-col gap-8", className ?? ""].join(" ")}>
      <span className="text-caption leading-18 font-bold text-text-accent">{label ?? `${step} / 3`}</span>
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={3}
        aria-valuenow={step}
        className="h-4 w-full overflow-hidden rounded-full bg-bg-subtle"
      >
        <div className={["h-4 rounded-full bg-fill-primary", BAR[step]].join(" ")} />
      </div>
    </div>
  );
}

export default StepProgress;
