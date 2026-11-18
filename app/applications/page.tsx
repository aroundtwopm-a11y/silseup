"use client";

// S10 가입 신청 내역 (결정 D-S10-01~11)
// 주소(/applications)로만 들어오고 나가는 곳은 없다.
// 가입 신청 1건마다 ListRow 3행(요금제 / 상태 / 접수 일시). 접수 상태에만 "취소" 버튼.
// 취소한 가입 신청 id는 useDraft()의 canceledApplications에 보관한다.
import { Button, Header, ListRow } from "@/components/ui";
import { useDraft } from "@/app/_lib/session";
import fixtures from "@/app/_lib/fixtures.json";

const NOT_CANCELABLE = "처리 중이거나 완료된 가입 신청은 취소할 수 없어요.";

export default function ApplicationsPage() {
  const [draft, update] = useDraft();
  const canceled = Array.isArray(draft.canceledApplications) ? (draft.canceledApplications as string[]) : [];

  const cancel = (id: string) => {
    if (canceled.includes(id)) return;
    update({ canceledApplications: [...canceled, id] });
  };

  return (
    <>
      <Header type="root" title="가입 신청 내역" />
      <main className="flex flex-1 flex-col gap-24 px-16 py-24">
        {fixtures.applications.map((app) => {
          const plan = fixtures.plans.find((p) => p.id === app.planId);
          const status = canceled.includes(app.id) ? "취소" : app.status;
          return (
            <section key={app.id} data-testid="application" className="flex flex-col gap-12">
              <div className="flex flex-col">
                <ListRow type="default" label="요금제" value={plan?.name ?? ""} />
                <ListRow type="default" label="상태" value={status} />
                <ListRow type="default" label="접수 일시" value={app.receivedAt} />
              </div>
              {status === "접수" ? (
                <div className="flex justify-end">
                  <Button variant="Secondary" size="sm" label="취소" onClick={() => cancel(app.id)} />
                </div>
              ) : null}
              {status === "처리 중" || status === "완료" ? (
                <p className="text-caption leading-18 font-medium text-text-tertiary">{NOT_CANCELABLE}</p>
              ) : null}
            </section>
          );
        })}
      </main>
    </>
  );
}
