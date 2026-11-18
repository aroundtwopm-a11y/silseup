// docs/token.json.txt → app/tokens.css (Tailwind v4 @theme)
// - Tailwind 기본 색·모서리·글자 크기·그림자를 지우고 토큰만 남긴다.
// - --spacing: 1px 이므로 p-16 = 16px. 간격 클래스의 숫자가 곧 px 값이다.
// - 사용: npm run tokens  (옵션: --out <경로>)
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadTokens } from "./allowlist.mjs";

const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const out = outIdx >= 0 ? path.resolve(args[outIdx + 1]) : path.join(ROOT, "app", "tokens.css");

const t = loadTokens();
const slug = (n) => n.replace(/\//g, "-");
const lines = [];
lines.push("/* 자동 생성 파일. 손으로 고치지 않는다.");
lines.push(" * 원본: docs/token.json.txt  생성: npm run tokens */");
lines.push("");
lines.push("@theme {");
lines.push("  --color-*: initial;");
lines.push("  --radius-*: initial;");
lines.push("  --text-*: initial;");
lines.push("  --shadow-*: initial;");
lines.push("  --spacing: 1px;");
lines.push("");
lines.push("  /* 색: semantic 토큰만 */");
for (const [name, v] of Object.entries(t.semantic)) {
  if (v.type === "COLOR") lines.push(`  --color-${slug(name)}: ${v.value};`);
}
lines.push("");
lines.push("  /* 모서리 */");
for (const [name, v] of Object.entries(t.radius)) {
  lines.push(`  --radius-${name.split("/").slice(1).join("-")}: ${v.value}px;`);
}
lines.push("");
lines.push("  /* 글꼴과 글자 크기 */");
for (const [name, v] of Object.entries(t.typography)) {
  if (name.startsWith("font-family/")) lines.push(`  --font-sans: "${v.value}", sans-serif;`);
  else if (name.startsWith("font-size/")) lines.push(`  --text-${name.slice("font-size/".length)}: ${v.value}px;`);
}
lines.push("}");
lines.push("");

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, lines.join("\n"), "utf8");
console.log(`tokens.css 생성: ${path.relative(ROOT, out) || out} (색 ${Object.keys(t.semantic).length}, 모서리 ${Object.keys(t.radius).length}, 간격 ${Object.keys(t.spacing).length})`);
