// flow.json 기준으로 고객 유형별 앞·다음 화면의 라우트를 찾는다.
// 화면은 이 결과를 useRouter().push()로 넘긴다.
import flow from "./flow.json";

type CustomerType = keyof typeof flow;
type Screen = (typeof flow)["port"][number];

const START_ROUTE = "/auth";

function routeOf(screen: Screen, planId?: string): string {
  switch (screen) {
    case "S1":
      return "/auth";
    case "S2":
      return "/conditions";
    case "S3":
      return "/plans";
    case "S4":
      return planId ? `/plans/${planId}` : "/plans";
    case "S5":
      return "/application/personal";
    case "S6":
      return "/application/options";
    case "S7":
      return "/application/payment";
    case "S8":
      return "/application/review";
    case "S9":
      return "/application/complete";
    default:
      return START_ROUTE;
  }
}

function step(type: CustomerType | undefined, current: Screen, offset: -1 | 1, planId?: string): string {
  if (!type) return START_ROUTE;
  const list: string[] = flow[type];
  const index = list.indexOf(current);
  const target = index >= 0 ? list[index + offset] : undefined;
  return target ? routeOf(target as Screen, planId) : START_ROUTE;
}

/** 고객 유형 흐름에서 바로 앞 화면 라우트 */
export function prevRoute(type: CustomerType | undefined, current: Screen, planId?: string) {
  return step(type, current, -1, planId);
}

/** 고객 유형 흐름에서 바로 다음 화면 라우트 */
export function nextRoute(type: CustomerType | undefined, current: Screen, planId?: string) {
  return step(type, current, 1, planId);
}
