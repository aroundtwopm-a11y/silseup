// 게이트 렌더링 테스트 공통 도구. 화면 파일이 아직 없으면 테스트를 건너뛴다.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { ComponentType } from "react";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export const PAGES = {
  S3: "app/plans/page.tsx",
  S6: "app/application/options/page.tsx",
} as const;

export const SESSION_FILE = "app/_lib/session.ts";

export type Customer = { type: "existing" | "port"; contractRemaining?: boolean; [k: string]: unknown };
export type Fixtures = { customers: Record<"existingRemaining" | "existingEnded" | "port", Customer>; plans: unknown[]; contractOptions: string[] };

export const exists = (rel: string) => fs.existsSync(path.join(ROOT, rel));

export function loadFixtures(): Fixtures | null {
  const f = path.join(ROOT, "app/_lib/fixtures.json");
  return fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, "utf8")) as Fixtures) : null;
}

export async function loadPage(rel: string): Promise<ComponentType> {
  const mod = await import(/* @vite-ignore */ path.join(ROOT, rel));
  return mod.default as ComponentType;
}

export const isDisabled = (el: HTMLElement) => el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true";
