"use client";

// S1 로그인 · 본인인증 (결정 D-S1-01~09)
// 본인인증 버튼 하나. 실제 연동 없이 예시 고객 3명 중 하나를 골라 들어간다.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BottomCTA, OptionItem } from "@/components/ui";
import { useDraft } from "@/app/_lib/session";
import { nextRoute } from "@/app/_lib/nav";
import fixtures from "@/app/_lib/fixtures.json";

type CustomerKey = keyof typeof fixtures.customers;

const CHOICES: { key: CustomerKey; title: string; desc: string }[] = [
  { key: "existingRemaining", title: "기존 고객", desc: "약정 남음" },
  { key: "existingEnded", title: "기존 고객", desc: "약정 끝남" },
  { key: "port", title: "번호이동 고객", desc: "U+ 가입 정보 없음" },
];

export default function AuthPage() {
  const router = useRouter();
  const [, update] = useDraft();
  const [selected, setSelected] = useState<CustomerKey | null>(null);

  const handleVerify = () => {
    if (!selected) return;
    update({ customerKey: selected });
    router.push(nextRoute(fixtures.customers[selected].type as "existing" | "port", "S1"));
  };

  return (
    <>
      <main className="flex flex-1 flex-col gap-12 px-16 py-24">
        <div role="radiogroup" aria-label="예시 고객" className="flex flex-col gap-12">
          {CHOICES.map((choice) => (
            <OptionItem
              key={choice.key}
              state={selected === choice.key ? "selected" : "default"}
              title={choice.title}
              desc={choice.desc}
              onClick={() => setSelected(choice.key)}
            />
          ))}
        </div>
      </main>
      <BottomCTA
        layout="single"
        primaryLabel="본인인증"
        disabled={!selected}
        onPrimaryClick={handleVerify}
        className="sticky bottom-0"
      />
    </>
  );
}
