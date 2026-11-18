// G1 라우트 수 · G3 컴포넌트 재정의 · G8 결정 누락 · G9 흐름·뒤로 가기
import fs from "node:fs";
import path from "node:path";
import {
  ROOT, ALL_SCREENS, EXPECTED_FLOWS, FLOW_FILE, appRoutes, decisions, implementedScreens,
  lineOf, openItems, progress, readJson, rel, routeMap, walk,
} from "../spec.mjs";

const result = (status, count, details = []) => ({ status, count, details });

// G1: 구현된 화면 수 = 라우트 수, 표에 없는 라우트 0개
export function g1Routes() {
  const routes = routeMap();
  const known = new Map(Object.entries(routes).filter(([, r]) => r).map(([s, r]) => [r, s]));
  const done = implementedScreens();
  const found = appRoutes();
  const details = [];
  let bad = 0;
  for (const { route, file } of found) {
    if (route === "/") continue; // 결정: / → S1
    if (!known.has(route)) {
      bad++;
      details.push(`${file}: 화면 표에 없는 라우트 ${route}`);
    }
  }
  const screenRoutes = found.filter((f) => known.has(f.route)).map((f) => known.get(f.route));
  for (const s of done) {
    if (!routes[s]) { bad++; details.push(`${s}: 라우트가 정해지지 않음 (결정 '라우트' 행 확정 필요)`); }
    else if (!screenRoutes.includes(s)) { bad++; details.push(`${s}: 구현 완료로 기록됐지만 ${routes[s]} 라우트 파일 없음`); }
  }
  for (const s of screenRoutes) {
    if (!done.includes(s)) { bad++; details.push(`${s}: 라우트 파일이 있지만 progress.json에 4-implement done 없음`); }
  }
  if (!done.length && !screenRoutes.length && !bad) return result("대상 없음", 0, ["구현된 화면 0개"]);
  details.unshift(`구현 기록 ${done.length}개 / 화면 라우트 ${screenRoutes.length}개`);
  return result(bad ? "실패" : "통과", bad, details);
}

// G3: 공용 컴포넌트 재정의 0개 + components/ui 목록 일치
export const UI_COMPONENTS = [
  "Button", "Input", "Checkbox", "Chip", "Tag", "Header", "ListRow", "BottomCTA",
  "CardPlan", "OptionItem", "StepProgress", "FilterChip", "ArrowLeft", "IconCheck", "DoneMark", "Logo",
];
export function g3Components({ uiOnly = false } = {}) {
  const details = [];
  let bad = 0;
  if (!uiOnly) {
    const re = new RegExp(`\\b(?:function|const|let|var|class)\\s+(${UI_COMPONENTS.join("|")})\\b`, "g");
    for (const f of walk("app", [".tsx", ".ts", ".jsx", ".js"])) {
      const text = fs.readFileSync(f, "utf8");
      let m;
      while ((m = re.exec(text))) {
        bad++;
        details.push(`${rel(f)}:${lineOf(text, m.index)} 공용 컴포넌트 ${m[1]}를 app/ 안에서 다시 정의`);
      }
    }
  }
  const uiDir = path.join(ROOT, "components", "ui");
  const tokensDone = progress().common?.["3-tokens"] === "done";
  if (fs.existsSync(uiDir) || tokensDone || uiOnly) {
    const files = fs.existsSync(uiDir) ? fs.readdirSync(uiDir).filter((f) => !f.startsWith(".")) : [];
    for (const name of UI_COMPONENTS) {
      if (!files.includes(`${name}.tsx`)) { bad++; details.push(`components/ui/${name}.tsx 없음`); }
    }
    for (const f of files) {
      const base = f.replace(/\.(tsx|ts)$/, "");
      if (f === "index.ts") continue;
      if (!UI_COMPONENTS.includes(base)) { bad++; details.push(`components/ui/${f}: design.md 목록 밖의 파일`); }
    }
  }
  return result(bad ? "실패" : "통과", bad, details);
}

// G8: 결정 ID가 없는 "확인 필요" 0개 (stage 2에서는 '임시'도 허용)
export function g8Decisions(screens, { allowTemporary = false } = {}) {
  if (!screens.length) return result("대상 없음", 0, ["화면 번호를 주지 않음"]);
  const ds = decisions();
  const details = [];
  let bad = 0;
  for (const s of screens) {
    const items = openItems(s);
    if (!items.length) continue;
    if (ds == null) { bad += items.length; details.push(`${s}: decisions.md 없음 (확인 필요 ${items.length}곳)`); continue; }
    for (const it of items) {
      const d = ds.find((x) => x.screen === s && x.sourceLine === it.line);
      if (!d) { bad++; details.push(`${s} SCREEN-SPEC.md:L${it.line} 결정 행 없음 — ${it.text.slice(0, 60)}`); continue; }
      const ok = d.status === "확정" || d.status === "구현 안 함" || (allowTemporary && d.status === "임시");
      if (!ok) { bad++; details.push(`${d.id} (L${it.line}) 상태 '${d.status}' — 승인 필요`); }
    }
  }
  return result(bad ? "실패" : "통과", bad, details);
}

// G9: flow.json = PRD 5.1, history.back/router.back 0회
export function g9Flow() {
  const flow = readJson(FLOW_FILE);
  const details = [];
  let bad = 0;
  if (!flow) {
    if (!implementedScreens().length) return result("대상 없음", 0, ["flow.json 없음, 구현된 화면 0개"]);
    return result("실패", 1, ["app/_lib/flow.json 없음"]);
  }
  for (const [type, expected] of Object.entries(EXPECTED_FLOWS)) {
    const got = flow[type];
    if (JSON.stringify(got) !== JSON.stringify(expected)) {
      bad++;
      details.push(`flow.json ${type}: ${JSON.stringify(got)} ≠ PRD 5.1 ${JSON.stringify(expected)}`);
    }
  }
  const backRe = /\b(?:history\.back|router\.back|\.back)\s*\(/g;
  for (const f of walk("app", [".tsx", ".ts", ".jsx", ".js"])) {
    const text = fs.readFileSync(f, "utf8");
    let m;
    while ((m = backRe.exec(text))) { bad++; details.push(`${rel(f)}:${lineOf(text, m.index)} ${m[0]} 사용 (flow.json의 앞 화면으로 push해야 함)`); }
  }
  return result(bad ? "실패" : "통과", bad, details);
}

export { ALL_SCREENS };
