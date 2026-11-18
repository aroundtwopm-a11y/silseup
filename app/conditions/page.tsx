"use client";

// S2 추천 조건 입력 (결정 D-S2-01~10)
// 번호이동 고객이 월 예산과 지금 내는 요금을 금액으로 직접 입력한다. 유효성 검사·오류 표시는 하지 않는다.
import { useRouter } from "next/navigation";
import { BottomCTA, Header, Input } from "@/components/ui";
import { useCustomer, useDraft } from "@/app/_lib/session";
import { nextRoute, prevRoute } from "@/app/_lib/nav";

const asText = (v: unknown) => (typeof v === "string" ? v : "");

export default function ConditionsPage() {
  const router = useRouter();
  const customer = useCustomer();
  const [draft, update] = useDraft();
  const type = customer?.type ?? "port";

  return (
    <>
      <Header type="default" title="추천 조건 입력" onBack={() => router.push(prevRoute(type, "S2"))} />
      <main className="flex flex-1 flex-col gap-24 px-16 py-24">
        <Input
          aria-label="월 예산"
          placeholder="월 예산"
          inputMode="numeric"
          value={asText(draft.budget)}
          onChange={(e) => update({ budget: e.target.value })}
        />
        <Input
          aria-label="지금 내는 요금"
          placeholder="지금 내는 요금"
          inputMode="numeric"
          value={asText(draft.currentFee)}
          onChange={(e) => update({ currentFee: e.target.value })}
        />
      </main>
      <BottomCTA
        layout="single"
        primaryLabel="다음 · 요금제 추천 보기"
        onPrimaryClick={() => router.push(nextRoute(type, "S2"))}
        className="sticky bottom-0"
      />
    </>
  );
}
