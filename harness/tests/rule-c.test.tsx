// G6 개수 고정: S3 추천 요금제 카드는 고객 유형과 상관없이 정확히 3개
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PAGES, SESSION_FILE, exists, loadFixtures, loadPage, type Customer } from "./helpers";

const state = vi.hoisted(() => ({ customer: null as unknown, push: vi.fn() }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: state.push, replace: state.push, back: state.push, forward: state.push, refresh: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => "/plans",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));
vi.mock("@/app/_lib/session", () => ({
  useCustomer: () => state.customer,
  useDraft: () => [{}, vi.fn()],
}));

const fx = loadFixtures();
const ready = exists(PAGES.S3) && exists(SESSION_FILE) && fx != null;

afterEach(() => cleanup());

describe.skipIf(!ready)("G6 추천 요금제 3개 (S3)", () => {
  for (const key of ["existingRemaining", "existingEnded", "port"] as const) {
    it(`G6 ${key} 고객의 S3 카드 3개`, async () => {
      state.customer = fx!.customers[key] as Customer;
      const Page = await loadPage(PAGES.S3);
      render(<Page />);
      expect(screen.queryAllByTestId("plan-card").length).toBe(3);
    });
  }
});
