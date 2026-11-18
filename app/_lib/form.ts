// 가입 폼(S5~S7) 입력값의 기본값과 읽기 도구. S8·S9가 같은 기본값으로 요약을 보여 준다.
// 개인 정보 기본값은 G10 허용 예시값만 쓴다. 약정·결합할인 기본값은 결정 D-S6-03·04.
import fixtures from "./fixtures.json";

export const SIM_OPTIONS = ["일반 유심", "eSIM"] as const;
export const BUNDLE_OPTIONS = ["예", "아니오"] as const;

const DEFAULTS = {
  name: "예시 이름",
  birth: "2000.01.01",
  phone: "010-0000-0000",
  email: "user@example.com",
  contract: fixtures.contractOptions[0],
  bundle: BUNDLE_OPTIONS[0] as string,
  sim: SIM_OPTIONS[0] as string,
  payMethod: "신용카드",
  cardHolder: "예시 이름",
  cardNumber: "0000 0000 **** 0000",
  cardExpiry: "00/00",
};

export type FormKey = keyof typeof DEFAULTS;

/** draft에 값이 없으면 기본값을 돌려준다 */
export function formValue(draft: Record<string, unknown>, key: FormKey): string {
  const v = draft[key];
  return typeof v === "string" ? v : DEFAULTS[key];
}

/** draft의 planId로 고른 요금제 */
export function selectedPlan(draft: Record<string, unknown>) {
  return fixtures.plans.find((p) => p.id === draft.planId);
}
