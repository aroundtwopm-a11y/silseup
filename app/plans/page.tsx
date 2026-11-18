"use client";

// S3 요금제 추천 (screens.md 01, 결정 D-S3-01~04)
// 추천 요금제는 고객 유형과 상관없이 fixtures.json의 3개를 기본형 카드로 보여 준다.
import { useRouter } from "next/navigation";
import { CardPlan, Header } from "@/components/ui";
import { useDraft } from "@/app/_lib/session";
import { monthlyWon } from "@/app/_lib/format";
import fixtures from "@/app/_lib/fixtures.json";

export default function PlansPage() {
  const router = useRouter();
  const [, update] = useDraft();

  const openPlan = (planId: string) => {
    update({ planId });
    router.push(`/plans/${planId}`);
  };

  return (
    <>
      <Header type="root" title="요금제 추천" />
      <main className="flex flex-1 flex-col gap-24 px-16 py-24">
        <section className="flex flex-col gap-8">
          <h2 className="text-heading-h3 leading-32 font-bold text-text-primary">나에게 맞는 요금제를 선택해 주세요</h2>
          <p className="text-body-small leading-21 font-medium text-text-secondary">카드를 누르면 상세 내용을 확인할 수 있어요.</p>
        </section>
        <section className="flex flex-col gap-12">
          <h3 className="text-subtitle leading-26 font-bold text-text-primary">추천 요금제</h3>
          {fixtures.plans.map((plan) => (
            <div key={plan.id} onClick={() => openPlan(plan.id)} className="cursor-pointer">
              <CardPlan
                state="default"
                name={plan.name}
                desc={`데이터 ${plan.data} · 통화 ${plan.call} · 문자 ${plan.sms}`}
                price={monthlyWon(plan.price)}
                badge={false}
                promo={false}
                sale={false}
                buttonLabel="자세히"
              />
            </div>
          ))}
        </section>
        <section className="flex flex-col gap-4">
          <p className="text-caption leading-18 font-medium text-text-tertiary">표시된 요금제와 금액은 예시입니다.</p>
          <p className="text-caption leading-18 font-medium text-text-tertiary">요금제 카드를 선택해 상세 페이지로 이동</p>
        </section>
      </main>
    </>
  );
}
