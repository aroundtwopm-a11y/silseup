// G4b·G5·G6b 렌더링 테스트 · G11 tsc·lint·build · G12 단계 커밋 범위
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { ROOT } from "../spec.mjs";

const result = (status, count, details = []) => ({ status, count, details });
const run = (cmd) =>
  spawnSync(cmd, { cwd: ROOT, shell: true, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, env: { ...process.env, FORCE_COLOR: "0", NEXT_TELEMETRY_DISABLED: "1" } });

// 렌더링 테스트: 테스트 이름 앞의 "G4"·"G5"·"G6"으로 게이트를 나눈다
export function renderTests() {
  const out = path.join(os.tmpdir(), `harness-vitest-${process.pid}.json`);
  const r = run(`npx vitest run --config harness/tests/vitest.config.mts --reporter=json --outputFile=${JSON.stringify(out)}`);
  const by = { G4: [], G5: [], G6: [] };
  if (!fs.existsSync(out)) {
    const err = (r.stderr || r.stdout || "").split("\n").slice(-15).join("\n");
    for (const g of Object.keys(by)) by[g] = [{ status: "failed", name: "vitest 실행 실패", message: err }];
    return by;
  }
  const json = JSON.parse(fs.readFileSync(out, "utf8"));
  fs.rmSync(out, { force: true });
  for (const file of json.testResults ?? []) {
    if (file.status === "failed" && !(file.assertionResults ?? []).length) {
      const g = /rule-a/.test(file.name) ? "G4" : /rule-b/.test(file.name) ? "G5" : "G6";
      by[g].push({ status: "failed", name: path.basename(file.name), message: file.message });
    }
    for (const t of file.assertionResults ?? []) {
      const g = (t.fullName || t.title).match(/\b(G4|G5|G6)\b/)?.[1];
      if (g) by[g].push({ status: t.status, name: t.fullName || t.title, message: (t.failureMessages ?? []).join(" ").split("\n")[0] });
    }
  }
  return by;
}

export function testGate(list) {
  const failed = list.filter((t) => t.status === "failed");
  const passed = list.filter((t) => t.status === "passed");
  if (!failed.length && !passed.length) return result("대상 없음", 0, ["해당 화면이 아직 없어 테스트를 건너뜀"]);
  const details = [...failed.map((t) => `실패: ${t.name} — ${t.message ?? ""}`.slice(0, 200)), ...passed.map((t) => `통과: ${t.name}`)];
  return result(failed.length ? "실패" : "통과", failed.length, details);
}

// G11
export function g11Build() {
  const details = [];
  let bad = 0;
  for (const [label, cmd] of [["tsc", "npx tsc --noEmit"], ["lint", "npm run lint --silent"], ["build", "npm run build --silent"]]) {
    const r = run(cmd);
    if (r.status === 0) { details.push(`${label}: 에러 0`); continue; }
    bad++;
    const tail = `${r.stdout ?? ""}\n${r.stderr ?? ""}`.split("\n").filter((l) => /error|Error|✖|Failed/.test(l)).slice(0, 8);
    details.push(`${label}: 실패 (exit ${r.status})`, ...tail.map((l) => "  " + l.trim()));
  }
  return result(bad ? "실패" : "통과", bad, details);
}

// G12: harness(<화면|common>): <단계>-<이름> 커밋에서 그 단계 폴더 밖 변경 0개
const STAGE_SCOPE = {
  2: ["SCREEN-SPEC.md", "ONE-PAGER.md", "harness/decisions/"],
  3: ["components/ui/", "app/tokens.css"],
  4: ["app/"],
  5: ["harness/reports/"],
};
const ALWAYS = ["harness/progress.json"];
export function g12Scope(screens) {
  const log = run(`git log --format=%H%x09%s`);
  if (log.status !== 0) return result("대상 없음", 0, ["git 기록 없음"]);
  const commits = log.stdout
    .split("\n")
    .map((l) => l.split("\t"))
    .map(([sha, subject]) => ({ sha, subject, m: subject?.match(/^harness\((S\d+|common)\):\s*(\d)-/) }))
    .filter((c) => c.m && (!screens.length || c.m[1] === "common" || screens.includes(c.m[1])));
  if (!commits.length) return result("대상 없음", 0, ["하네스 단계 커밋 없음"]);
  const details = [];
  let bad = 0;
  for (const c of commits) {
    const stage = Number(c.m[2]);
    const scope = STAGE_SCOPE[stage] ?? [];
    const files = run(`git show --name-only --format= ${c.sha}`).stdout.split("\n").map((s) => s.trim()).filter(Boolean);
    for (const f of files) {
      const inScope = ALWAYS.includes(f) || scope.some((s) => (s.endsWith("/") ? f.startsWith(s) : f === s));
      const forbidden = stage === 4 && f === "app/tokens.css";
      if (!inScope || forbidden) { bad++; details.push(`${c.sha.slice(0, 7)} "${c.subject}": 폴더 밖 변경 ${f}`); }
    }
  }
  details.unshift(`검사한 단계 커밋 ${commits.length}개`);
  return result(bad ? "실패" : "통과", bad, details);
}
