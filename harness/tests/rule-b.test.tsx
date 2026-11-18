// G5 ★B 위약금 동의 필수: 약정이 남은 기존 고객은 동의 전 S6 CTA 비활성, 이동 0회
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PAGES, SESSION_FILE, exists, isDisabled, loadFixtures, loadPage, type Customer } from "./helpers";

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

describe.skipIf(!ready)("G5 ★B 위약금 동의 필수 (S6)", () => {
  it("G5 동의 전: CTA 비활성이고 눌러도 이동 0회", async () => {
    state.customer = fx!.customers.existingRemaining as Customer;
    const Page = await loadPage(PAGES.S6);
    render(<Page />);
    const cta = screen.getByTestId("bottom-cta-primary");
    expect(isDisabled(cta)).toBe(true);
    fireEvent.click(cta);
    expect(state.push).toHaveBeenCalledTimes(0);
  });

  it("G5 동의 후: CTA 활성", async () => {
    state.customer = fx!.customers.existingRemaining as Customer;
    const Page = await loadPage(PAGES.S6);
    render(<Page />);
    fireEvent.click(screen.getByTestId("penalty-agree"));
    expect(isDisabled(screen.getByTestId("bottom-cta-primary"))).toBe(false);
  });

  it("G5 약정이 끝난 기존 고객·번호이동 고객에게는 위약금 동의가 없음", async () => {
    const Page = await loadPage(PAGES.S6);
    for (const key of ["existingEnded", "port"] as const) {
      state.customer = fx!.customers[key] as Customer;
      render(<Page />);
      expect(screen.queryByTestId("penalty-agree")).toBeNull();
      cleanup();
    }
  });
});
