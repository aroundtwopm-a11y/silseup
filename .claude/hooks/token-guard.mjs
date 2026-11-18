// PreToolUse 훅: app/, components/, lib/에 쓰는 내용에 토큰 밖 값이 있으면 거부한다 (exit 2).
// 허용 목록은 매번 docs/token.json.txt에서 새로 읽는다 (harness/scripts/allowlist.mjs와 같은 검사기).
// - Write: 파일 전체 내용 검사
// - Edit / MultiEdit: 새로 넣는 문자열만 검사
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const { buildAllowlist, checkText, isChecked } = await import(pathToFileURL(path.join(ROOT, "harness/scripts/allowlist.mjs")).href);

let raw = "";
process.stdin.setEncoding("utf8");
for await (const c of process.stdin) raw += c;
const input = raw ? JSON.parse(raw) : {};
const ti = input.tool_input ?? {};
const target = ti.file_path ?? ti.notebook_path;
if (!target) process.exit(0);

const rel = path.relative(ROOT, path.resolve(input.cwd ?? ROOT, target)).replace(/\\/g, "/");
if (rel.startsWith("..") || !isChecked(rel)) process.exit(0);

const texts = [];
if (typeof ti.content === "string") texts.push(ti.content);
if (typeof ti.new_string === "string") texts.push(ti.new_string);
if (Array.isArray(ti.edits)) for (const e of ti.edits) if (typeof e?.new_string === "string") texts.push(e.new_string);
if (typeof ti.new_source === "string") texts.push(ti.new_source);

const A = buildAllowlist();
const violations = texts.flatMap((t) => checkText(t, rel, A));
if (!violations.length) process.exit(0);

const lines = violations.slice(0, 15).map((v) => `- ${rel}:${v.line} ${v.rule} \`${v.detail}\``);
if (violations.length > 15) lines.push(`- … 외 ${violations.length - 15}개`);
process.stderr.write(
  `[token-guard] 토큰 밖 값 ${violations.length}개로 쓰기 거부 (G2)\n${lines.join("\n")}\n` +
    `허용: semantic 색(bg-bg-surface 등), 간격 토큰 숫자(p-16), rounded-<토큰>, text-<글자 크기 토큰>, leading-<design 줄높이>. 기준: docs/token.json.txt\n`,
);
process.exit(2);
