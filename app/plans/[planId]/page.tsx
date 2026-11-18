"use client";

// S4 요금제 상세 (screens.md 02, 결정 D-S4-01~06)
// 뒤로 가기·가입하기 이동은 flow.json에서 고객 유형별 앞·다음 화면을 찾는다.
import { Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { BottomCTA, Header, ListRow } from "@/components/ui";
import { useCustomer, useDraft } from "@/app/_lib/session";
import { nextRoute, prevRoute } from "@/app/_lib/nav";
import { monthlyWon } from "@/app/_lib/format";
import fixtures from "@/app/_lib/fixtures.json";

// Cache Components: useParams()는 <Suspense> 안에서 읽어야 정적 셸을 만들 수 있다.
export default function PlanDetailPage() {
  return (
    <Suspense fallback={null}>
      <PlanDetail />
    </Suspense>
  );
}

function PlanDetail() {
  const router = useRouter();
  const params = useParams<{ planId: string }>();
  const customer = useCustomer();
  const [, update] = useDraft();
  const plan = fixtures.plans.find((p) => p.id === params.planId);
  const type = customer?.type;

  const goBack = () => router.push(prevRoute(type ?? "port", "S4"));
  const join = () => {
    if (!plan) return;
    update({ planId: plan.id });
    router.push(nextRoute(type, "S4", plan.id));
  };

  return (
    <>
      <Header type="default" title="요금제 상세" onBack={goBack} />
      {plan ? (
        <main className="flex flex-1 flex-col gap-24 px-16 py-24">
          <section className="flex flex-col gap-4">
            <p className="text-body-small leading-21 font-medium text-text-secondary">선택한 요금제</p>
            <h2 className="text-heading-h3 leading-32 font-bold text-text-primary">{plan.name}</h2>
          </section>

          <section className="flex flex-col gap-4 rounded-16 bg-bg-surface p-20">
            <p className="text-heading-h4 leading-28 font-bold text-text-primary">{monthlyWon(plan.price)}</p>
            <p className="text-caption leading-18 font-medium text-text-tertiary">부가세 포함 · 월 납부 금액</p>
          </section>

          <section className="flex flex-col gap-8">
            <h3 className="text-subtitle leading-26 font-bold text-text-primary">요금제 제공 내역</h3>
            <div className="flex flex-col">
              <ListRow type="default" label="데이터" value={`월 ${plan.data}`} />
              <ListRow type="default" label="음성 통화" value={plan.call} />
              <ListRow type="default" label="문자" value={plan.sms} />
              <ListRow type="check" label="혜택" value="예시 혜택" />
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-12 bg-bg-accent-subtle p-16">
            <p className="text-body leading-24 font-semibold text-text-primary">결합할인을 받으면 월 18,000원</p>
            <p className="text-caption leading-18 font-medium text-text-tertiary">금액은 예시입니다.</p>
          </section>

          <section className="rounded-12 bg-bg-surface p-16">
            <p className="text-body-small leading-21 font-medium text-text-secondary">
              {`약정 기간은 ${fixtures.contractOptions.join(" 또는 ")} 중에서 고를 수 있어요.`}
            </p>
          </section>

          <section className="flex flex-col gap-4 rounded-12 bg-bg-subtle p-16">
            <h3 className="text-body leading-24 font-semibold text-text-primary">가입 전 확인</h3>
            <p className="text-body-small leading-21 font-medium text-text-secondary">선택한 요금제는 가입 폼에서 다시 확인할 수 있어요.</p>
            <p className="text-body-small leading-21 font-medium text-text-secondary">다른 요금제를 보려면 뒤로 가기를 눌러 주세요.</p>
          </section>
        </main>
      ) : (
        <main className="flex-1" />
      )}
      <BottomCTA layout="single" primaryLabel="가입하기" onPrimaryClick={join} className="sticky bottom-0" />
    </>
  );
}
