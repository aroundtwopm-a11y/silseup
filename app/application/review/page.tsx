"use client";

// S8 입력 정보 확인 (screens.md 06, 결정 D-S8-01~07)
// 고객 유형에 맞는 항목만 보여 준다.
// - 번호이동 고객: 개인 정보 · 요금제 및 옵션 · 결제 정보
// - 기존 고객: 요금제 및 옵션 (+ 약정이 남았으면 위약금 동의)
import { useRouter } from "next/navigation";
import { BottomCTA, Header, ListRow } from "@/components/ui";
import { useCustomer, useDraft } from "@/app/_lib/session";
import { nextRoute, prevRoute } from "@/app/_lib/nav";
import { won } from "@/app/_lib/format";
import { draftMonthlyPrice, formValue, selectedPlan } from "@/app/_lib/form";

export default function ReviewPage() {
  const router = useRouter();
  const customer = useCustomer();
  const [draft] = useDraft();
  const type = customer?.type;
  const isPort = type === "port";
  const needsPenalty = type === "existing" && customer?.contractRemaining === true;
  const plan = selectedPlan(draft);
  const cardNumber = formValue(draft, "cardNumber").replace(/\s/g, "");

  // "수정"은 고객 유형의 가입 폼 첫 단계로 간다 (번호이동 S5, 기존 S6).
  const edit = () => router.push(isPort ? "/application/personal" : "/application/options");

  const section = (title: string, rows: { label: string; value: string }[]) => (
    <section className="flex flex-col gap-8">
      <h3 className="text-subtitle leading-26 font-bold text-text-primary">{title}</h3>
      <div className="flex flex-col">
        {rows.map((r) => (
          <ListRow key={r.label} type="default" label={r.label} value={r.value} />
        ))}
      </div>
    </section>
  );

  return (
    <>
      <Header type="default" title="입력 정보 확인" onBack={() => router.push(prevRoute(type, "S8"))} />
      <main className="flex flex-1 flex-col gap-24 px-16 py-24">
        <section className="flex flex-col gap-4">
          <h2 className="text-heading-h3 leading-32 font-bold text-text-primary">가입 신청 내용을 확인해 주세요</h2>
          <p className="text-body-small leading-21 font-medium text-text-secondary">수정이 필요하면 가입 폼으로 돌아갈 수 있어요.</p>
        </section>

        {isPort
          ? section("개인 정보", [
              { label: "이름", value: formValue(draft, "name") },
              { label: "생년월일", value: formValue(draft, "birth") },
              { label: "연락처", value: formValue(draft, "phone") },
              { label: "이메일", value: formValue(draft, "email") },
            ])
          : null}

        {section("요금제 및 옵션", [
          { label: "요금제", value: plan?.name ?? "" },
          { label: "약정 기간", value: formValue(draft, "contract") },
          { label: "결합할인 여부", value: formValue(draft, "bundle") },
          ...(isPort ? [{ label: "유심 유형", value: formValue(draft, "sim") }] : []),
        ])}

        {isPort
          ? section("결제 정보", [
              { label: "납부 수단", value: `${formValue(draft, "payMethod")} · 끝 ${cardNumber.slice(-4)}` },
              { label: "월 납부 금액", value: plan ? won(draftMonthlyPrice(draft, plan.price)) : "" },
            ])
          : null}

        {needsPenalty ? section("위약금 동의", [{ label: "위약금 동의", value: "동의함" }]) : null}
      </main>
      <BottomCTA
        layout="double"
        secondaryLabel="수정"
        primaryLabel="가입 신청"
        onSecondaryClick={edit}
        onPrimaryClick={() => router.push(nextRoute(type, "S8"))}
        className="sticky bottom-0"
      />
    </>
  );
}
