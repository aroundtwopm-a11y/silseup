"use client";

// S9 가입 신청 완료 (screens.md 07, 결정 D-S9-01~07)
// 완료는 가입 신청 '접수'를 뜻한다. 실제 변경·개통은 나중에 처리된다. 이동 버튼 없이 플로우를 끝낸다.
import { DoneMark, Header, ListRow } from "@/components/ui";
import { useCustomer, useDraft } from "@/app/_lib/session";
import { won } from "@/app/_lib/format";
import { formValue, selectedPlan } from "@/app/_lib/form";

export default function CompletePage() {
  const customer = useCustomer();
  const [draft] = useDraft();
  const isPort = customer?.type === "port";
  const plan = selectedPlan(draft);

  const rows = [
    ...(isPort ? [{ label: "가입 신청자", value: formValue(draft, "name") }] : []),
    { label: "가입 유형", value: isPort ? "번호이동 가입" : "요금제 변경" },
    { label: "요금제", value: plan?.name ?? "" },
    { label: "약정 기간", value: formValue(draft, "contract") },
    { label: "결합할인 여부", value: formValue(draft, "bundle") },
    ...(isPort ? [{ label: "유심 유형", value: formValue(draft, "sim") }] : []),
    { label: "월 납부 금액", value: plan ? won(plan.price) : "" },
  ];

  return (
    <>
      <Header type="root" title="가입 신청 접수" />
      <main className="flex flex-1 flex-col gap-24 px-16 py-24">
        <section className="flex flex-col items-center gap-12 py-24">
          <DoneMark />
          <h2 className="text-heading-h3 leading-32 font-bold text-text-primary">가입 신청이 접수되었습니다</h2>
          <p className="text-body-small leading-21 font-medium text-text-secondary">가입 신청 내용은 아래와 같습니다.</p>
        </section>

        <section className="flex flex-col gap-8">
          <h3 className="text-subtitle leading-26 font-bold text-text-primary">가입 신청 요약</h3>
          <div className="flex flex-col">
            {rows.map((r) => (
              <ListRow key={r.label} type="default" label={r.label} value={r.value} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-12 bg-bg-surface p-16">
          <p className="text-body-small leading-21 font-medium text-text-secondary">
            실제 요금제 변경과 개통은 나중에 처리되고, 결과는 연락처로 안내됩니다.
          </p>
          <p className="text-body-small leading-21 font-semibold text-text-primary">
            {`연락처 ${isPort ? formValue(draft, "phone") : "010-0000-0000"}`}
          </p>
        </section>

        <p className="text-center text-caption leading-18 font-medium text-text-tertiary">가입 신청 절차가 종료되었습니다.</p>
      </main>
    </>
  );
}
