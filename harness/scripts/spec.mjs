// 게이트가 같이 쓰는 기준 읽기: 화면 표, 결정 표, 진행 기록, 기대 흐름, 파일 목록
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./allowlist.mjs";

export { ROOT };
export const SPEC_FILE = path.join(ROOT, "SCREEN-SPEC.md");
export const DECISIONS_FILE = path.join(ROOT, "harness", "decisions", "decisions.md");
export const PROGRESS_FILE = path.join(ROOT, "harness", "progress.json");
export const FLOW_FILE = path.join(ROOT, "app", "_lib", "flow.json");
export const FIXTURES_FILE = path.join(ROOT, "app", "_lib", "fixtures.json");

// PRD 5.1 흐름 (docs/PRD.md 73~74줄)
export const EXPECTED_FLOWS = {
  existing: ["S1", "S3", "S4", "S6", "S8", "S9"],
  port: ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9"],
};
export const ALL_SCREENS = ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S8", "S9", "S10"];

// G10 허용 예시값
export const EXAMPLE_VALUES = {
  names: ["예시 이름"],
  phones: ["010-0000-0000"],
  emailDomain: "example.com",
  cards: ["0000 0000 **** 0000"],
  births: ["2000.01.01"],
};

export const readText = (f) => (fs.existsSync(f) ? fs.readFileSync(f, "utf8") : null);
export const readJson = (f) => {
  const t = readText(f);
  return t == null ? null : JSON.parse(t);
};
export const rel = (abs) => path.relative(ROOT, abs).replace(/\\/g, "/");

// SCREEN-SPEC.md의 "## 화면 요약" 표
export function screenTable() {
  const text = readText(SPEC_FILE) ?? "";
  const rows = [];
  text.split(/\r?\n/).forEach((line, i) => {
    const m = line.match(/^\|\s*(S\d+)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|/);
    if (m) rows.push({ id: m[1], name: m[2], route: m[3], audience: m[4], line: i + 1 });
  });
  return rows;
}

// SCREEN-SPEC.md에서 화면별 "확인 필요" 줄 번호
export function openItems(screenId) {
  const lines = (readText(SPEC_FILE) ?? "").split(/\r?\n/);
  const result = [];
  let section = null;
  lines.forEach((line, i) => {
    const h = line.match(/^##\s+(\S+)/);
    if (h) section = h[1];
    if (!line.includes("확인 필요")) return;
    if (section === screenId) result.push({ line: i + 1, text: line.trim() });
    else if (section === "화면" && new RegExp(`^\\|\\s*${screenId}\\s*\\|`).test(line)) result.push({ line: i + 1, text: line.trim() });
  });
  return result;
}

// harness/decisions/decisions.md 표
export function decisions() {
  const text = readText(DECISIONS_FILE);
  if (text == null) return null;
  const rows = [];
  text.split(/\r?\n/).forEach((line) => {
    const cells = line.split("|").slice(1, -1).map((c) => c.trim());
    if (cells.length < 7 || !/^D-S\d+-\d+$/.test(cells[0])) return;
    const [id, screen, source, item, value, status, basis] = cells;
    const lm = source.match(/SCREEN-SPEC\.md:L(\d+)/);
    rows.push({ id, screen, source, sourceLine: lm ? Number(lm[1]) : null, item, value, status, basis });
  });
  return rows;
}

// 화면별 라우트: 표 → 없으면 결정의 "라우트" 행
export function routeMap({ allowTemporary = false } = {}) {
  const ds = decisions() ?? [];
  const map = {};
  for (const row of screenTable()) {
    let route = row.route.match(/^\/[^\s(]*/)?.[0] ?? null;
    if (!route) {
      const d = ds.find((x) => x.screen === row.id && x.item === "라우트" && (x.status === "확정" || (allowTemporary && x.status === "임시")));
      route = d?.value.replace(/`/g, "").match(/^\/[^\s(]*/)?.[0] ?? null;
    }
    map[row.id] = route;
  }
  return map;
}

export function progress() {
  return readJson(PROGRESS_FILE) ?? {};
}
export function implementedScreens() {
  const p = progress();
  return ALL_SCREENS.filter((s) => p[s]?.["4-implement"] === "done");
}

// 파일 목록
export function walk(dirRel, exts) {
  const base = path.join(ROOT, dirRel);
  const out = [];
  if (!fs.existsSync(base)) return out;
  const stack = [base];
  while (stack.length) {
    const d = stack.pop();
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.name === "node_modules" || e.name === ".next") continue;
      const p = path.join(d, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (!exts || exts.includes(path.extname(e.name).toLowerCase())) out.push(p);
    }
  }
  return out.sort();
}

// app/ 아래 page 파일 → 라우트
export function appRoutes() {
  return walk("app", [".tsx", ".ts", ".jsx", ".js"])
    .filter((f) => /^page\.(tsx|ts|jsx|js)$/.test(path.basename(f)))
    .map((f) => {
      const segs = rel(path.dirname(f)).split("/").slice(1);
      if (segs.some((s) => s.startsWith("_"))) return null;
      const route =
        "/" +
        segs
          .filter((s) => !/^\(.*\)$/.test(s))
          .map((s) => s.replace(/^\[\.\.\.(.+)\]$/, "*$1").replace(/^\[(.+)\]$/, ":$1"))
          .join("/");
      return { route: route === "/" ? "/" : route.replace(/\/$/, ""), file: rel(f) };
    })
    .filter(Boolean);
}

export function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}
