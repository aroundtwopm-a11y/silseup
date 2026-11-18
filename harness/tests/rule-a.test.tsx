// G4 ★A 고객 유형별 입력 분리: 기존 고객의 S6에는 유심 유형이 0개
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PAGES, SESSION_FILE, exists, loadFixtures, loadPage, type Customer } from "./helpers";

const state = vi.hoisted(() => ({ customer: null as unknown, push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: state.push, replace: state.push, back: state.push, forward: state.push, refresh: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/application/options",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));
vi.mock("@/app/_lib/session", () => ({
  useCustomer: () => state.customer,
  useDraft: () => [{}, vi.fn()],
}));

const fx = loadFixtures();
const ready = exists(PAGES.S6) && exists(SESSION_FILE) && fx != null;

afterEach(() => {
  cleanup();
  state.push.mockClear();
});

describe.skipIf(!ready)("G4 ★A 고객 유형별 입력 분리 (S6)", () => {
  for (const key of ["existingRemaining", "existingEnded"] as const) {
    it(`G4 기존 고객(${key})의 S6에 유심 유형 0개`, async () => {
      state.customer = fx!.customers[key] as Customer;
      const Page = await loadPage(PAGES.S6);
      render(<Page />);
      expect(screen.queryAllByText(/유심|eSIM/).length).toBe(0);
    });
  }

  it("G4 번호이동 고객의 S6에는 유심 선택지(일반 유심, eSIM)가 있음", async () => {
    state.customer = fx!.customers.port as Customer;
    const Page = await loadPage(PAGES.S6);
    render(<Page />);
    expect(screen.queryAllByText(/^\s*일반 유심\s*$/).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryAllByText(/^\s*eSIM\s*$/).length).toBeGreaterThanOrEqual(1);
  });
});
