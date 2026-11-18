// G2 토큰 밖 값 · G4a 기존 고객 흐름 · G6a 개수·선택지 · G7 용어 · G10 개인정보
import fs from "node:fs";
import { buildAllowlist, checkText, isChecked } from "../allowlist.mjs";
import { EXAMPLE_VALUES, FIXTURES_FILE, FLOW_FILE, lineOf, readJson, rel, walk } from "../spec.mjs";

const result = (status, count, details = []) => ({ status, count, details });
const SRC_EXTS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".json"];
const uiFiles = (dirs) => dirs.flatMap((d) => walk(d, SRC_EXTS));

// G2
export function g2Tokens({ dirs = ["app", "components", "lib"] } = {}) {
  const A = buildAllowlist();
  const details = [];
  let n = 0;
  for (const f of uiFiles(dirs)) {
    const r = rel(f);
    if (!isChecked(r)) continue;
    for (const v of checkText(fs.readFileSync(f, "utf8"), r, A)) {
      n++;
      if (details.length < 40) details.push(`${v.file}:${v.line} ${v.rule} \`${v.detail}\``);
    }
  }
  if (n > details.length) details.push(`… 외 ${n - details.length}개`);
  return result(n ? "실패" : "통과", n, details);
}

// G4a: 기존 고객 흐름에 S5·S7 0회
export function g4aFlow() {
  const flow = readJson(FLOW_FILE);
  if (!flow) return result("대상 없음", 0, ["app/_lib/flow.json 없음"]);
  const hits = (flow.existing ?? []).filter((s) => s === "S5" || s === "S7");
  return result(hits.length ? "실패" : "통과", hits.length, hits.map((s) => `flow.json existing에 ${s} 포함`));
}

// G6a: 요금제 3개, 약정 {12개월, 24개월}, "무약정" 0회
export function g6aChoices() {
  const details = [];
  let bad = 0;
  const fx = readJson(FIXTURES_FILE);
  if (fx) {
    if ((fx.plans ?? []).length !== 3) { bad++; details.push(`fixtures.json plans ${fx.plans?.length ?? 0}개 (3개여야 함)`); }
    if (JSON.stringify(fx.contractOptions) !== JSON.stringify(["12개월", "24개월"])) {
      bad++; details.push(`fixtures.json contractOptions ${JSON.stringify(fx.contractOptions)} (["12개월","24개월"]이어야 함)`);
    }
  }
  for (const f of uiFiles(["app", "components"])) {
    const text = fs.readFileSync(f, "utf8");
    const re = /무약정/g;
    let m;
    while ((m = re.exec(text))) { bad++; details.push(`${rel(f)}:${lineOf(text, m.index)} "무약정"`); }
  }
  if (!fx && !bad) return result("대상 없음", 0, ["fixtures.json 없음"]);
  return result(bad ? "실패" : "통과", bad, details);
}

// G7: '가입' 없이 쓴 '신청' 0회
export function g7Terms() {
  const details = [];
  let n = 0;
  for (const f of uiFiles(["app", "components"])) {
    const text = fs.readFileSync(f, "utf8");
    const re = /(?<!가입\s?)신청/g;
    let m;
    while ((m = re.exec(text))) {
      n++;
      const line = text.split("\n")[lineOf(text, m.index) - 1].trim();
      if (details.length < 30) details.push(`${rel(f)}:${lineOf(text, m.index)} ${line.slice(0, 70)}`);
    }
  }
  return result(n ? "실패" : "통과", n, details);
}

// G10: 예시값 밖의 전화번호·이메일·카드 번호·생년월일·이름 0개
export function g10Pii() {
  const details = [];
  let n = 0;
  const patterns = [
    { name: "전화번호", re: /\b01[016789][-\s.]?\d{3,4}[-\s.]?\d{4}\b/g, ok: (v) => EXAMPLE_VALUES.phones.includes(v) },
    { name: "이메일", re: /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, ok: (v) => v.toLowerCase().endsWith("@" + EXAMPLE_VALUES.emailDomain) },
    { name: "카드 번호", re: /\b\d{4}[\s-]\d{4}[\s-][\d*]{4}[\s-]\d{4}\b/g, ok: (v) => EXAMPLE_VALUES.cards.includes(v) },
    { name: "생년월일", re: /\b(?:19|20)\d{2}[.\-/](?:0[1-9]|1[0-2])[.\-/](?:0[1-9]|[12]\d|3[01])\b/g, ok: (v) => EXAMPLE_VALUES.births.includes(v) },
  ];
  for (const f of uiFiles(["app", "components"])) {
    const text = fs.readFileSync(f, "utf8");
    for (const p of patterns) {
      let m;
      p.re.lastIndex = 0;
      while ((m = p.re.exec(text))) {
        if (p.ok(m[0])) continue;
        n++;
        details.push(`${rel(f)}:${lineOf(text, m.index)} 예시값이 아닌 ${p.name}`);
      }
    }
  }
  const fx = readJson(FIXTURES_FILE);
  const walkNames = (o, at) => {
    if (!o || typeof o !== "object") return;
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === "string" && /^(name|holder|cardHolder|applicant)$/i.test(k) && at !== "plans") {
        if (!EXAMPLE_VALUES.names.includes(v)) { n++; details.push(`fixtures.json ${k}="${v}"는 예시 이름이 아님`); }
      } else walkNames(v, at ?? k);
    }
  };
  if (fx) for (const [k, v] of Object.entries(fx)) if (k !== "plans") walkNames(v, k);
  return result(n ? "실패" : "통과", n, details);
}
