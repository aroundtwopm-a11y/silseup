"use client";

// S7 가입 폼 · 결제 정보 (screens.md 05, 결정 D-S7-01~04)
// 번호이동 고객만 거친다. 입력 필드 4개는 예시값으로 채워진 상태(State=filled)로 시작한다.
import { useRouter } from "next/navigation";
import { BottomCTA, Header, Input, ListRow, StepProgress } from "@/components/ui";
import { useCustomer, useDraft } from "@/app/_lib/session";
import { nextRoute, prevRoute } from "@/app/_lib/nav";
import { won } from "@/app/_lib/format";
import { formValue, selectedPlan, type FormKey } from "@/app/_lib/form";

const STEPS = ["1 개인 정보", "2 요금제 옵션", "3 결제 정보"];

const FIELDS: { key: FormKey; label: string; inputMode?: "numeric" }[] = [
  { key: "payMethod", label: "납부 방법" },
  { key: "cardHolder", label: "카드 명의자" },
  { key: "cardNumber", label: "카드 번호", inputMode: "numeric" },
  { key: "cardExpiry", label: "유효기간", inputMode: "numeric" },
];

export default function PaymentPage() {
  const router = useRouter();
  const customer = useCustomer();
  const [draft, update] = useDraft();
  const type = customer?.type ?? "port";
  const plan = selectedPlan(draft);

  return (
    <>
      <Header type="default" title="가입 폼" onBack={() => router.push(prevRoute(type, "S7"))} />
      <main className="flex flex-1 flex-col gap-24 px-16 py-24">
        <section className="flex flex-col gap-12">
          <StepProgress step={3} label="3 / 3 · 결제 정보 입력" />
          <ol className="flex gap-12">
            {STEPS.map((s, i) => (
              <li
                key={s}
                className={[
                  "text-caption leading-18",
                  i === 2 ? "font-bold text-text-accent" : "font-medium text-text-tertiary",
                ].join(" ")}
              >
                {s}
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-heading-h3 leading-32 font-bold text-text-primary">결제 정보 입력</h2>
          <p className="text-body-small leading-21 font-medium text-text-secondary">월 요금을 납부할 정보를 입력해 주세요.</p>
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

        {plan ? (
          <div className="flex flex-col">
            <ListRow type="default" label="월 납부 금액" value={won(plan.price)} />
          </div>
        ) : null}

        <p className="text-caption leading-18 font-medium text-text-tertiary">3 / 3 단계</p>
      </main>
      <BottomCTA
        layout="single"
        primaryLabel="다음 · 입력 정보 확인"
        onPrimaryClick={() => router.push(nextRoute(type, "S7"))}
        className="sticky bottom-0"
      />
    </>
  );
}
