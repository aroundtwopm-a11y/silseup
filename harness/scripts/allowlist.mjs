// 토큰 허용 목록과 토큰 밖 값 검사기.
// - 허용 목록은 실행할 때마다 docs/token.json.txt(SSOT)에서 새로 읽는다.
// - token-guard 훅(쓰기 직전)과 게이트 G2(전체 검사)가 같은 함수를 쓴다.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const TOKEN_FILE = path.join(ROOT, "docs", "token.json.txt");

export function loadTokens() {
  return JSON.parse(fs.readFileSync(TOKEN_FILE, "utf8"));
}

const slug = (name) => name.replace(/\//g, "-");

// 토큰 파일에 없지만 design.md.txt에 실측값으로 적힌 값. (출처: docs/design.md.txt 2·3·4장)
// 줄높이: 2장 텍스트 스타일 표의 줄높이
export const DESIGN_LINE_HEIGHTS = [44, 40, 32, 28, 26, 24, 21, 18, 16, 14];
// 크기(w/h): 3장 레이아웃 표와 4장 컴포넌트 크기
export const DESIGN_SIZES = [
  844, 390, 358, 342, 326, 318, 224, 223, 176, 174, 139, 114, 97, 91, 86, 83, 64, 58, 56, 52, 48,
  42, 40, 32, 30, 26, 24, 22, 20, 6, 4,
];
// 테두리 두께: Card/Plan·OptionItem 선택 1.5, 기본 1(=border)
export const DESIGN_BORDER_WIDTHS = ["0", "1.5"];

export function buildAllowlist(tokens = loadTokens()) {
  const spacing = new Set(Object.values(tokens.spacing).map((v) => String(v.value)));
  const radius = new Set(Object.keys(tokens.radius).map((k) => k.split("/").slice(1).join("/")));
  const colors = new Set(Object.keys(tokens.semantic).map(slug));
  const textSizes = new Set(
    Object.keys(tokens.typography)
      .filter((k) => k.startsWith("font-size/"))
      .map((k) => k.slice("font-size/".length)),
  );
  const sizes = new Set([...spacing, ...DESIGN_SIZES.map(String)]);
  const lineHeights = new Set(DESIGN_LINE_HEIGHTS.map(String));
  // CSS 파일 안의 px 값으로 허용되는 숫자
  const px = new Set([
    ...spacing,
    ...[...radius].filter((r) => /^\d+$/.test(r)),
    ...Object.values(tokens.radius).map((v) => String(v.value)),
    ...Object.values(tokens.typography)
      .filter((v) => v.type === "FLOAT")
      .map((v) => String(v.value)),
    ...lineHeights,
    ...sizes,
    "1",
    "1.5",
  ]);
  return { spacing, radius, colors, textSizes, sizes, lineHeights, px };
}

// ---- 클래스 검사 -------------------------------------------------------

const SPACING_PREFIXES = [
  "p", "px", "py", "pt", "pr", "pb", "pl", "ps", "pe",
  "m", "mx", "my", "mt", "mr", "mb", "ml", "ms", "me",
  "gap", "gap-x", "gap-y", "space-x", "space-y",
  "inset", "inset-x", "inset-y", "top", "right", "bottom", "left", "start", "end",
  "translate-x", "translate-y", "scroll-m", "scroll-p", "indent",
];
const SIZE_PREFIXES = ["w", "h", "size", "min-w", "min-h", "max-w", "max-h", "basis"];
const SIZE_KEYWORDS = new Set(["full", "auto", "screen", "fit", "min", "max", "dvh", "svh", "lvh", "dvw", "svw", "lvw", "none"]);
const RADIUS_PREFIXES = [
  "rounded", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-s", "rounded-e",
  "rounded-tl", "rounded-tr", "rounded-bl", "rounded-br", "rounded-ss", "rounded-se", "rounded-es", "rounded-ee",
];
const COLOR_PREFIXES = [
  "bg", "text", "border", "border-t", "border-r", "border-b", "border-l", "border-x", "border-y",
  "outline", "ring", "ring-offset", "fill", "stroke", "divide", "from", "via", "to",
  "decoration", "accent", "caret", "placeholder", "shadow",
];
const TEXT_KEYWORDS = new Set([
  "left", "center", "right", "start", "end", "justify",
  "ellipsis", "clip", "wrap", "nowrap", "balance", "pretty",
]);
const BG_KEYWORDS = new Set(["transparent", "none", "fixed", "local", "scroll", "cover", "contain", "center", "no-repeat", "repeat", "clip-border", "clip-padding", "clip-content", "clip-text"]);
const BORDER_KEYWORDS = new Set(["solid", "dashed", "dotted", "double", "none", "hidden", "collapse", "separate"]);
const SHARED_COLOR_KEYWORDS = new Set(["transparent", "current", "inherit"]);
const ALL_PREFIXES = [...new Set([...SPACING_PREFIXES, ...SIZE_PREFIXES, ...RADIUS_PREFIXES, ...COLOR_PREFIXES, "leading", "font", "tracking"])]
  .sort((a, b) => b.length - a.length);

function splitClass(cls) {
  // 변형(hover:, md: 등)과 !, - 접두어를 떼어 낸다
  let base = cls.split(":").pop();
  base = base.replace(/^!/, "").replace(/!$/, "");
  const negative = base.startsWith("-");
  if (negative) base = base.slice(1);
  for (const prefix of ALL_PREFIXES) {
    if (base === prefix) return { prefix, value: "" };
    if (base.startsWith(prefix + "-")) return { prefix, value: base.slice(prefix.length + 1) };
  }
  return null;
}

// 위반이면 이유 문자열, 아니면 null
export function checkClass(cls, A) {
  if (/\[.*\]/.test(cls)) return "대괄호 임의 값";
  if (/-\(--/.test(cls)) return "CSS 변수 임의 값";
  const parts = splitClass(cls);
  if (!parts) return null; // 값을 갖지 않는 유틸리티(flex, items-center 등)는 검사 대상 아님
  const { prefix, value } = parts;
  if (value.includes("/") && COLOR_PREFIXES.includes(prefix) && !/^\d+\/\d+$/.test(value)) return "색 투명도 변경(/N)";

  if (SPACING_PREFIXES.includes(prefix)) {
    if (value === "" || value === "auto" || value === "full") return null;
    if (/^\d+\/\d+$/.test(value)) return null;
    return A.spacing.has(value) ? null : `간격 토큰에 없는 값 ${value}`;
  }
  if (SIZE_PREFIXES.includes(prefix)) {
    if (SIZE_KEYWORDS.has(value) || /^\d+\/\d+$/.test(value)) return null;
    return A.sizes.has(value) ? null : `크기 허용 목록에 없는 값 ${value}`;
  }
  if (RADIUS_PREFIXES.includes(prefix)) {
    if (value === "") return "값 없는 rounded (토큰 이름을 붙인다)";
    return value === "none" || A.radius.has(value) ? null : `모서리 토큰에 없는 값 ${value}`;
  }
  if (prefix === "leading") {
    return value === "none" || A.lineHeights.has(value) ? null : `줄높이 허용 목록에 없는 값 ${value}`;
  }
  if (prefix === "font") {
    return ["sans", "medium", "semibold", "bold"].includes(value) ? null : `글꼴·굵기 허용 목록에 없는 값 ${value}`;
  }
  if (prefix === "tracking") {
    return value === "normal" ? null : `자간은 0%(tracking-normal)만 허용`;
  }
  if (prefix === "text") {
    if (A.colors.has(value) || A.textSizes.has(value) || TEXT_KEYWORDS.has(value) || SHARED_COLOR_KEYWORDS.has(value)) return null;
    return `색·글자 크기 토큰에 없는 값 ${value}`;
  }
  if (prefix === "bg") {
    if (A.colors.has(value) || BG_KEYWORDS.has(value) || SHARED_COLOR_KEYWORDS.has(value)) return null;
    return `색 토큰에 없는 값 ${value}`;
  }
  if (prefix.startsWith("border")) {
    if (value === "" || A.colors.has(value) || BORDER_KEYWORDS.has(value) || SHARED_COLOR_KEYWORDS.has(value)) return null;
    if (DESIGN_BORDER_WIDTHS.includes(value)) return null;
    return `테두리 색·두께 허용 목록에 없는 값 ${value}`;
  }
  if (prefix === "shadow") {
    if (value === "none" || A.colors.has(value)) return null;
    return value === "" ? "값 없는 shadow (그림자 크기 토큰 없음)" : `그림자 허용 목록에 없는 값 ${value}`;
  }
  if (prefix === "outline" || prefix === "ring" || prefix === "ring-offset" || prefix === "divide") {
    if (value === "" || ["0", "none", "hidden", "x", "y"].includes(value) || A.colors.has(value) || SHARED_COLOR_KEYWORDS.has(value)) return null;
    return `색 토큰에 없는 값 ${value}`;
  }
  // fill, stroke, from, via, to, decoration, accent, caret, placeholder
  if (value === "" || value === "none" || A.colors.has(value) || SHARED_COLOR_KEYWORDS.has(value)) return null;
  return `색 토큰에 없는 값 ${value}`;
}

// ---- 파일 내용 검사 -----------------------------------------------------

// 클래스로 보지 않을 문자열(속성 값·import 경로 등) 앞부분
const SKIP_BEFORE = /(?:data-[\w-]+|aria-[\w-]+|\bid|\bhref|\bkey|\bname|\bhtmlFor|\brole|\btype|\bsrc|\balt|\btitle|\bplaceholder|\bvalue|\blabel|\bLabel|\bTitle|\bDesc|\bName|\bAmount|\bAmountLabel|\bPrice|\bOriginal|\bDiscount|\btestid|\bfrom|\bimport\s*\(|\brequire\s*\(|\bpush\s*\(|\breplace\s*\(|\bredirect\s*\()\s*[=:(]?\s*\{?\s*$/;

function lineOf(text, index) {
  return text.slice(0, index).split("\n").length;
}

function stringLiterals(text) {
  const out = [];
  const re = /"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
  let m;
  while ((m = re.exec(text))) {
    const body = m[1] ?? m[2] ?? m[3] ?? "";
    const before = text.slice(Math.max(0, m.index - 40), m.index);
    if (/^\s*(?:import|export)\b/.test(text.slice(text.lastIndexOf("\n", m.index) + 1, m.index))) continue;
    if (SKIP_BEFORE.test(before)) continue;
    out.push({ body: body.replace(/\$\{[^}]*\}/g, " "), index: m.index });
  }
  return out;
}

const HEX = /(?<![&\w])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g;
const COLOR_FN = /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color-mix)\s*\(/g;

export function checkText(text, file, A = buildAllowlist()) {
  const violations = [];
  const add = (index, rule, detail) => violations.push({ file, line: lineOf(text, index), rule, detail });
  const ext = path.extname(file).toLowerCase();

  let m;
  HEX.lastIndex = 0;
  while ((m = HEX.exec(text))) add(m.index, "색 직접 쓰기", m[0]);
  COLOR_FN.lastIndex = 0;
  while ((m = COLOR_FN.exec(text))) add(m.index, "색 함수 직접 쓰기", m[0]);

  if (ext === ".css") {
    const pxRe = /(-?\d*\.?\d+)px\b/g;
    while ((m = pxRe.exec(text))) {
      const n = String(Math.abs(Number(m[1])));
      if (!A.px.has(n)) add(m.index, "토큰 밖 px 값", m[0]);
    }
    return violations;
  }

  const styleRe = /style\s*=\s*\{\{([\s\S]*?)\}\}/g;
  while ((m = styleRe.exec(text))) {
    if (/:\s*['"`]?-?\d/.test(m[1])) add(m.index, "인라인 style 숫자 값", m[0].slice(0, 60));
  }

  for (const lit of stringLiterals(text)) {
    for (const cls of lit.body.split(/\s+/).filter(Boolean)) {
      if (/[가-힣]/.test(cls)) continue; // 한글 문구
      if (!/^[!-]?[a-z0-9[(@][\w\-:./[\]()%#,!*'&>+~=@]*$/i.test(cls)) continue;
      const reason = checkClass(cls, A);
      if (reason) add(lit.index, reason, cls);
    }
  }
  return violations;
}

// 검사 대상 파일인지 (프로젝트 루트 기준 상대 경로, / 구분)
export const CHECK_DIRS = ["app/", "components/", "lib/"];
export const CHECK_EXTS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"];
export const GENERATED = ["app/tokens.css"];

export function isChecked(rel) {
  const r = rel.replace(/\\/g, "/");
  if (GENERATED.includes(r)) return false;
  return CHECK_DIRS.some((d) => r.startsWith(d)) && CHECK_EXTS.includes(path.extname(r).toLowerCase());
}
