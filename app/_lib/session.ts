// 고른 예시 고객과 입력값을 브라우저 sessionStorage에 보관한다.
// 내보내는 것은 useCustomer(), useDraft() 두 개뿐이다.
// 고객 선택(S1)은 useDraft()의 update({ customerKey })로 기록하고, useCustomer()가 그 키로 fixtures.json의 고객을 돌려준다.
import { useCallback, useSyncExternalStore } from "react";
import fixtures from "./fixtures.json";

type CustomerKey = keyof typeof fixtures.customers;
type Customer = { type: "existing" | "port"; contractRemaining?: boolean; penalty?: number };
type Draft = {
  customerKey?: CustomerKey;
  planId?: string;
  [key: string]: unknown;
};

const STORAGE_KEY = "harness-draft";
const EMPTY: Draft = {};
const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedDraft: Draft = EMPTY;

function readDraft(): Draft {
  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedDraft = raw ? (JSON.parse(raw) as Draft) : EMPTY;
    } catch {
      cachedDraft = EMPTY;
    }
  }
  return cachedDraft;
}

function readServerDraft(): Draft {
  return EMPTY;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function writeDraft(patch: Partial<Draft>) {
  const next = { ...readDraft(), ...patch };
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
}

export function useDraft(): [Draft, (patch: Partial<Draft>) => void] {
  const draft = useSyncExternalStore(subscribe, readDraft, readServerDraft);
  const update = useCallback((patch: Partial<Draft>) => writeDraft(patch), []);
  return [draft, update];
}

export function useCustomer(): Customer | null {
  const [draft] = useDraft();
  const key = draft.customerKey;
  if (!key || !(key in fixtures.customers)) return null;
  return fixtures.customers[key] as Customer;
}
