// 하네스 게이트 실행기
//   npm run gate                 전체 게이트 (화면 지정 없음)
//   npm run gate -- S3 S6        해당 화면 기준 전체 게이트
//   npm run gate -- S3 --stage 2 2단계 끝 조건 (G8: '임시' 허용, G12)
//   npm run gate -- --stage 3    3단계 끝 조건 (G2·G3는 components/ui만, G11, G12)
// 결과: harness/reports/<화면|all|stage-N>.md 작성, 실패가 1개라도 있으면 exit 1
import fs from "node:fs";
import path from "node:path";
import { ROOT, ALL_SCREENS } from "./spec.mjs";
import { g1Routes, g3Components, g8Decisions, g9Flow } from "./checks/structure.mjs";
import { g2Tokens, g4aFlow, g6aChoices, g7Terms, g10Pii } from "./checks/content.mjs";
import { renderTests, testGate, g11Build, g12Scope } from "./checks/process.mjs";

const args = process.argv.slice(2);
const stageIdx = args.indexOf("--stage");
const stage = stageIdx >= 0 ? Number(args[stageIdx + 1]) : null;
const screens = args.filter((a, i) => /^S\d+$/i.test(a) && i !== stageIdx + 1).map((s) => s.toUpperCase());
const unknown = screens.filter((s) => !ALL_SCREENS.includes(s));
if (unknown.length) {
  console.error(`알 수 없는 화면: ${unknown.join(", ")} (S1~S10)`);
  process.exit(2);
}

const NAMES = {
  G1: "라우트 수", G2: "토큰 밖 값", G3: "컴포넌트 재정의", G4: "★A 고객 유형별 입력 분리",
  G5: "★B 위약금 동의 필수", G6: "개수·선택지 고정", G7: "용어 '가입'", G8: "결정 누락",
  G9: "흐름·뒤로 가기", G10: "개인정보 예시값", G11: "tsc·lint·build", G12: "단계 커밋 범위",
};
const BACK = { G1: 4, G2: "3/4", G3: "3/4", G4: 4, G5: 4, G6: 4, G7: 4, G8: "2 (멈추고 묻기)", G9: 4, G10: 4, G11: "해당 폴더 단계", G12: "해당 커밋 단계" };

const merge = (...rs) => {
  const real = rs.filter((r) => r.status !== "대상 없음");
  if (!real.length) return { status: "대상 없음", count: 0, details: rs.flatMap((r) => r.details) };
  const failed = real.some((r) => r.status === "실패");
  return { status: failed ? "실패" : "통과", count: real.reduce((a, r) => a + r.count, 0), details: rs.flatMap((r) => r.details) };
};

const results = {};
const t0 = Date.now();
if (stage === 2) {
  results.G8 = g8Decisions(screens, { allowTemporary: true });
  results.G12 = g12Scope(screens);
} else if (stage === 3) {
  results.G2 = g2Tokens({ dirs: ["components"] });
  results.G3 = g3Components({ uiOnly: true });
  results.G11 = g11Build();
  results.G12 = g12Scope([]);
} else {
  const tests = renderTests();
  results.G1 = g1Routes();
  results.G2 = g2Tokens();
  results.G3 = g3Components();
  results.G4 = merge(g4aFlow(), testGate(tests.G4));
  results.G5 = testGate(tests.G5);
  results.G6 = merge(g6aChoices(), testGate(tests.G6));
  results.G7 = g7Terms();
  results.G8 = g8Decisions(screens);
  results.G9 = g9Flow();
  results.G10 = g10Pii();
  results.G11 = g11Build();
  results.G12 = g12Scope(screens);
}

const failed = Object.entries(results).filter(([, r]) => r.status === "실패");
const label = stage ? `stage-${stage}${screens.length ? "-" + screens.join("-") : ""}` : screens.length ? screens.join("-") : "all";
const now = new Date();
const lines = [
  `# 게이트 보고서: ${label}`,
  "",
  `- 실행: ${now.toISOString()} (${Math.round((Date.now() - t0) / 1000)}초)`,
  `- 화면: ${screens.length ? screens.join(", ") : "지정 안 함"}${stage ? ` · 단계 ${stage} 끝 조건` : ""}`,
  `- 판정: **${failed.length ? "실패" : "통과"}** (실패 ${failed.length}개)`,
  "",
  "| 게이트 | 이름 | 결과 | 개수 | 실패 시 돌아갈 단계 |",
  "|---|---|---|---|---|",
  ...Object.entries(results).map(([g, r]) => `| ${g} | ${NAMES[g]} | ${r.status} | ${r.count} | ${r.status === "실패" ? BACK[g] : "—"} |`),
  "",
  "## 상세",
  "",
  ...Object.entries(results).flatMap(([g, r]) => [`### ${g} ${NAMES[g]} — ${r.status}`, ...(r.details.length ? r.details.map((d) => `- ${d}`) : ["- 없음"]), ""]),
];
const reportDir = path.join(ROOT, "harness", "reports");
fs.mkdirSync(reportDir, { recursive: true });
const reportFile = path.join(reportDir, `${label}.md`);
fs.writeFileSync(reportFile, lines.join("\n"), "utf8");

for (const [g, r] of Object.entries(results)) console.log(`${g.padEnd(4)} ${r.status.padEnd(5)} ${String(r.count).padStart(3)}  ${NAMES[g]}`);
console.log(`\n판정: ${failed.length ? "실패" : "통과"} · 보고서: ${path.relative(ROOT, reportFile).replace(/\\/g, "/")}`);
process.exit(failed.length ? 1 : 0);
