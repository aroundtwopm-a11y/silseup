// PreToolUse 훅: 하네스가 지키는 경로에 쓰기·고치기를 거부한다 (exit 2).
// 막는 곳: docs/, reference/ (원본 읽기 전용), harness/scripts/, harness/tests/ (게이트),
//          .claude/ (에이전트·훅·설정), app/tokens.css (npm run tokens로만 생성)
// 이 파일들을 바꿔야 하면 사람이 에디터에서 직접 고친다.
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PROTECTED_DIRS = ["docs/", "reference/", "harness/scripts/", "harness/tests/", ".claude/"];
const PROTECTED_FILES = ["app/tokens.css"];

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (c) => (raw += c));
process.stdin.on("end", () => {
  const input = raw ? JSON.parse(raw) : {};
  const ti = input.tool_input ?? {};
  const target = ti.file_path ?? ti.notebook_path;
  if (!target) process.exit(0);
  const abs = path.resolve(input.cwd ?? ROOT, target);
  const rel = path.relative(ROOT, abs).replace(/\\/g, "/");
  if (rel.startsWith("..") || path.isAbsolute(rel)) process.exit(0); // 프로젝트 밖은 관여하지 않음
  const lower = rel.toLowerCase();
  const hitDir = PROTECTED_DIRS.find((d) => lower.startsWith(d));
  const hitFile = PROTECTED_FILES.find((f) => lower === f);
  if (!hitDir && !hitFile) process.exit(0);
  const why = hitFile
    ? `${rel}은 자동 생성 파일이다. npm run tokens로만 만든다.`
    : `${hitDir}는 하네스가 지키는 폴더다 (docs·reference는 읽기 전용, 게이트·설정은 사람이 직접 고친다).`;
  process.stderr.write(`[scope-guard] 쓰기 거부: ${rel}\n${why}\n`);
  process.exit(2);
});
