"use client";

// S6 가입 폼 · 요금제 옵션 (screens.md 04, 결정 D-S6-01~15)
// - 번호이동 고객: 단계 표시(2 / 3), 약정 기간 · 결합할인 · 유심 유형 선택, 다음 → S7
// - 기존 고객: 단계 표시 없음, 약정 기간 · 결합할인만 선택, 다음 → S8
// - 약정이 남은 기존 고객: 예상 위약금 안내 + 동의 Checkbox. 동의 전에는 다음 버튼 Disabled
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BottomCTA, Checkbox, FilterChip, Header, ListRow, StepProgress } from "@/components/ui";
import { useCustomer, useDraft } from "@/app/_lib/session";
import { nextRoute, prevRoute } from "@/app/_lib/nav";
import { monthlyWon, won } from "@/app/_lib/format";
import { BUNDLE_OPTIONS, SIM_OPTIONS, formValue, selectedPlan, type FormKey } from "@/app/_lib/form";
import fixtures from "@/app/_lib/fixtures.json";

const STEPS = ["1 개인 정보", "2 요금제 옵션", "3 결제 정보"];

export default function OptionsPage() {
  const router = useRouter();
  const customer = useCustomer();
  const [draft, update] = useDraft();
  const isPort = customer?.type === "port";
  const needsPenalty = customer?.type === "existing" && customer.contractRemaining === true;
  // 화면 안에서 누른 값을 먼저 쓰고, 없으면 저장된 값(draft)을 쓴다.
  const [localAgreed, setAgreed] = useState<boolean | null>(null);
  const agreed = localAgreed ?? draft.penaltyAgreed === true;

  const plan = selectedPlan(draft);
  const planId = plan?.id;
  const contract = formValue(draft, "contract");
  const bundle = formValue(draft, "bundle");
  const sim = formValue(draft, "sim");
  const blocked = needsPenalty && !agreed;

  const toggleAgree = (next: boolean) => {
    setAgreed(next);
    update({ penaltyAgreed: next });
  };

  const goNext = () => {
    if (blocked) return;
    update({ contract, bundle, ...(isPort ? { sim } : {}) });
    router.push(nextRoute(customer?.type, "S6", planId));
  };

  const chipGroup = (title: string, key: FormKey, options: readonly string[], current: string) => (
    <section className="flex flex-col gap-8">
      <h3 className="text-body leading-24 font-semibold text-text-primary">{title}</h3>
      <div className="flex flex-wrap gap-8">
        {options.map((o) => (
          <FilterChip
            key={o}
            label={o}
            state={o === current ? "selected" : "default"}
            onClick={() => update({ [key]: o })}
          />
        ))}
      </div>
    </section>
  );

  return (
    <>
      <Header type="default" title="가입 폼" onBack={() => router.push(prevRoute(customer?.type, "S6", planId))} />
      <main className="flex flex-1 flex-col gap-24 px-16 py-24">
        {isPort ? (
          <section className="flex flex-col gap-12">
            <StepProgress step={2} label="2 / 3 · 요금제 옵션 선택" />
            <ol className="flex gap-12">
              {STEPS.map((s, i) => (
                <li
                  key={s}
                  className={[
                    "text-caption leading-18",
                    i === 1 ? "font-bold text-text-accent" : "font-medium text-text-tertiary",
                  ].join(" ")}
                >
                  {s}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <section className="flex flex-col gap-4">
          <h2 className="text-heading-h3 leading-32 font-bold text-text-primary">요금제 옵션 선택</h2>
          <p className="text-body-small leading-21 font-medium text-text-secondary">선택한 요금제의 가입 옵션을 정해 주세요.</p>
        </section>

        {plan ? (
          <section className="flex flex-col gap-4 rounded-16 bg-bg-surface p-20">
            <p className="text-subtitle leading-26 font-bold text-text-primary">{plan.name}</p>
            <p className="text-body leading-24 font-semibold text-text-primary">{monthlyWon(plan.price)}</p>
            <p className="text-caption leading-18 font-medium text-text-tertiary">
              {`데이터 ${plan.data} · 통화 ${plan.call} · 문자 ${plan.sms}`}
            </p>
          </section>
        ) : null}

        {chipGroup("약정 기간", "contract", fixtures.contractOptions, contract)}
        {chipGroup("결합할인", "bundle", BUNDLE_OPTIONS, bundle)}
        {isPort ? chipGroup("유심 유형", "sim", SIM_OPTIONS, sim) : null}

        {needsPenalty ? (
          <section className="flex flex-col gap-12 rounded-12 bg-bg-accent-subtle p-16">
            <div className="flex flex-col gap-4">
              <p className="text-body leading-24 font-semibold text-text-primary">약정이 남아 있어 위약금이 발생해요</p>
              <p className="text-body-small leading-21 font-medium text-text-secondary">
                {`예상 위약금 ${won(customer?.penalty ?? 0)} (예시)`}
              </p>
            </div>
            <div className="flex items-center gap-8">
              <Checkbox
                data-testid="penalty-agree"
                aria-labelledby="penalty-agree-label"
                state={agreed ? "active" : "default"}
                onChange={toggleAgree}
              />
              <span
                id="penalty-agree-label"
                onClick={() => toggleAgree(!agreed)}
                className="cursor-pointer text-body-small leading-21 font-medium text-text-primary"
              >
                예상 위약금을 확인했고 동의합니다
              </span>
            </div>
          </section>
        ) : null}

        <section className="flex flex-col gap-8">
          <h3 className="text-subtitle leading-26 font-bold text-text-primary">선택한 옵션</h3>
          <div className="flex flex-col">
            <ListRow type="default" label="약정 기간" value={contract} />
            <ListRow type="default" label="결합할인 여부" value={bundle} />
            {isPort ? <ListRow type="default" label="유심 유형" value={sim} /> : null}
          </div>
        </section>

        {isPort ? <p className="text-caption leading-18 font-medium text-text-tertiary">2 / 3 단계</p> : null}
      </main>
      <BottomCTA
        layout="single"
        primaryLabel={isPort ? "다음 · 결제 정보 입력" : "다음 · 입력 정보 확인"}
        disabled={blocked}
        onPrimaryClick={goNext}
        className="sticky bottom-0"
      />
    </>
  );
}
