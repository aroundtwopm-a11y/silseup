"use client";

// S5 가입 폼 · 개인 정보 (screens.md 03, 결정 D-S5-01~04)
// 번호이동 고객만 거친다. 입력 필드 4개는 예시값으로 채워진 상태(State=filled)로 시작한다.
import { useRouter } from "next/navigation";
import { BottomCTA, Header, Input, StepProgress } from "@/components/ui";
import { useCustomer, useDraft } from "@/app/_lib/session";
import { nextRoute, prevRoute } from "@/app/_lib/nav";
import { formValue, type FormKey } from "@/app/_lib/form";

const STEPS = ["1 개인 정보", "2 요금제 옵션", "3 결제 정보"];

const FIELDS: { key: FormKey; label: string; inputMode?: "numeric" | "tel" | "email" }[] = [
  { key: "name", label: "이름" },
  { key: "birth", label: "생년월일", inputMode: "numeric" },
  { key: "phone", label: "연락처", inputMode: "tel" },
  { key: "email", label: "이메일", inputMode: "email" },
];

export default function PersonalPage() {
  const router = useRouter();
  const customer = useCustomer();
  const [draft, update] = useDraft();
  const type = customer?.type ?? "port";
  const planId = typeof draft.planId === "string" ? draft.planId : undefined;

  return (
    <>
      <Header type="default" title="가입 폼" onBack={() => router.push(prevRoute(type, "S5", planId))} />
      <main className="flex flex-1 flex-col gap-24 px-16 py-24">
        <section className="flex flex-col gap-12">
          <StepProgress step={1} label="1 / 3 · 개인 정보 입력" />
          <ol className="flex gap-12">
            {STEPS.map((s, i) => (
              <li
                key={s}
                className={[
                  "text-caption leading-18",
                  i === 0 ? "font-bold text-text-accent" : "font-medium text-text-tertiary",
                ].join(" ")}
              >
                {s}
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-heading-h3 leading-32 font-bold text-text-primary">개인 정보 입력</h2>
          <p className="text-body-small leading-21 font-medium text-text-secondary">가입자 정보를 입력해 주세요.</p>
        </section>

        <section className="flex flex-col gap-16">
          {FIELDS.map((f) => (
            <label key={f.key} className="flex flex-col gap-4">
              <span className="text-caption leading-18 font-medium text-text-secondary">{f.label}</span>
              <Input
                aria-label={f.label}
                inputMode={f.inputMode}
                value={formValue(draft, f.key)}
                onChange={(e) => update({ [f.key]: e.target.value })}
              />
            </label>
          ))}
        </section>

        <p className="text-caption leading-18 font-medium text-text-tertiary">입력 정보는 가입 신청 확인 및 안내에 사용됩니다.</p>
        <p className="text-caption leading-18 font-medium text-text-tertiary">1 / 3 단계</p>
      </main>
      <BottomCTA
        layout="single"
        primaryLabel="다음 · 요금제 옵션 선택"
        onPrimaryClick={() => router.push(nextRoute(type, "S5"))}
        className="sticky bottom-0"
      />
    </>
  );
}
