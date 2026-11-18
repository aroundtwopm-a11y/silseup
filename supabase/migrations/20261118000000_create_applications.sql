-- 가입 신청 저장 테이블 (근거: docs/PRD.md 5~7장, docs/DOMAIN.md 5·6장, 화면 S6·S8·S9·S10)
--
-- 인증 전제
--   S1은 실제 본인인증 연동이 없다(결정 D-S1-04). 그래서 Supabase 익명 로그인
--   (supabase.auth.signInAnonymously())으로 브라우저마다 auth.uid()를 받고,
--   그 uid를 가입 신청의 주인으로 쓴다. 대시보드 Authentication > Providers에서
--   Anonymous sign-ins를 켜야 한다. 나중에 실제 본인인증을 붙여도 정책은 그대로 쓴다.
--
-- 권한 요약
--   plans        : 누구나 조회. 쓰기는 service_role만.
--   applications : 본인 것만 조회 · 본인 이름으로 '접수' 상태만 생성 ·
--                  '접수' → '취소' 변경만 허용 · 삭제 불가.
--                  '처리 중' · '완료'로 바꾸는 일은 서버(service_role)가 한다.

-- ───────────────────────── 요금제 ─────────────────────────
create table public.plans (
  id          text primary key,                        -- 예: '5gb'
  name        text    not null,
  price       integer not null check (price > 0),      -- 월 요금(원), 예시값
  data        text    not null,                        -- 제공 데이터, 예: '5GB'
  call        text    not null,                        -- 제공 통화, 예: '100분'
  sms         text    not null,                        -- 제공 문자, 예: '100건'
  created_at  timestamptz not null default now()
);

comment on table public.plans is '요금제. 금액은 예시값(PRD 7장)';

-- app/_lib/fixtures.json과 같은 예시 요금제
insert into public.plans (id, name, price, data, call, sms) values
  ('5gb',  '데이터 5GB',  15000, '5GB',  '100분',  '100건'),
  ('10gb', '데이터 10GB', 20000, '10GB', '무제한', '무제한'),
  ('20gb', '데이터 20GB', 28000, '20GB', '무제한', '무제한');

-- ───────────────────────── 가입 신청 ─────────────────────────
create table public.applications (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null default auth.uid()
                            references auth.users (id) on delete cascade,
  plan_id                 text not null references public.plans (id),

  -- 신청 유형: 기존 고객 = '요금제 변경', 번호이동 고객 = '번호이동 가입' (DOMAIN 6장)
  application_type        text not null
                            check (application_type in ('요금제 변경', '번호이동 가입')),

  -- S6 요금제 옵션
  contract_months         smallint not null check (contract_months in (12, 24)),  -- 무약정 없음
  bundle_discount         boolean  not null,                                       -- 결합할인 예/아니오
  bundle_discount_amount  integer  not null default 0 check (bundle_discount_amount >= 0), -- 예시값 2,000원
  sim_type                text check (sim_type in ('일반 유심', 'eSIM')),           -- 번호이동만

  -- S6 위약금 (약정이 남은 기존 고객만)
  penalty_amount          integer check (penalty_amount >= 0),                     -- 예상 위약금, 예시값
  penalty_agreed          boolean,

  -- S5 개인 정보 (번호이동만)
  applicant_name          text,
  applicant_birth         date,
  applicant_phone         text,
  applicant_email         text,

  -- S7 결제 정보 (번호이동만). 카드 번호 전체와 유효기간은 저장하지 않는다.
  pay_method              text,
  card_holder             text,
  card_last4              char(4) check (card_last4 ~ '^[0-9]{4}$'),

  -- S9 신청 요약에 보여 준 월 납부 금액(신청 시점 값)
  monthly_price           integer not null check (monthly_price >= 0),

  -- S10 상태
  status                  text not null default '접수'
                            check (status in ('접수', '처리 중', '완료', '취소')),
  received_at             timestamptz not null default now(),
  updated_at              timestamptz not null default now(),

  -- 결합할인을 안 받으면 할인 금액은 0
  constraint bundle_amount_matches check (bundle_discount or bundle_discount_amount = 0),

  -- 비즈니스 규칙 3·7·8: 개인 정보 · 결제 정보 · 유심 유형은 번호이동 고객만
  constraint port_fields_by_type check (
    case application_type
      when '번호이동 가입' then
        sim_type is not null
        and applicant_name is not null and applicant_birth is not null
        and applicant_phone is not null and applicant_email is not null
        and pay_method is not null and card_holder is not null and card_last4 is not null
      else
        sim_type is null
        and applicant_name is null and applicant_birth is null
        and applicant_phone is null and applicant_email is null
        and pay_method is null and card_holder is null and card_last4 is null
    end
  ),

  -- 비즈니스 규칙 4 (G5): 위약금은 기존 고객만, 위약금이 있으면 동의해야 저장된다
  constraint penalty_requires_agreement check (
    (penalty_amount is null and penalty_agreed is null)
    or (application_type = '요금제 변경' and penalty_amount is not null and penalty_agreed = true)
  )
);

comment on table public.applications is '가입 신청. 접수만 하고 실제 변경·개통은 나중에 처리(DOMAIN 규칙 9)';

create index applications_user_received_idx
  on public.applications (user_id, received_at desc);   -- S10 내 신청 목록

-- updated_at 자동 갱신
create function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger applications_touch_updated_at
  before update on public.applications
  for each row execute function public.touch_updated_at();

-- ───────────────────────── 권한 (RLS) ─────────────────────────
alter table public.plans        enable row level security;
alter table public.applications enable row level security;

-- 테이블 단위 권한: 기본으로 주어진 것을 걷고 필요한 것만 준다
revoke all on public.plans        from anon, authenticated;
revoke all on public.applications from anon, authenticated;

grant select on public.plans to anon, authenticated;

grant select, insert   on public.applications to authenticated;
grant update (status)  on public.applications to authenticated;   -- status 열만 바꿀 수 있다
-- delete 권한은 주지 않는다. 취소는 상태 변경으로만 한다.

-- plans: 누구나 조회
create policy "plans: 누구나 조회"
  on public.plans for select
  to anon, authenticated
  using (true);

-- applications: 본인 신청만 조회 (S10)
create policy "applications: 본인 것만 조회"
  on public.applications for select
  to authenticated
  using (user_id = (select auth.uid()));

-- applications: 본인 이름으로 '접수' 상태만 생성 (S8 "가입 신청")
create policy "applications: 본인 이름으로 접수만 생성"
  on public.applications for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and status = '접수'
  );

-- applications: '접수' 상태인 본인 신청을 '취소'로만 바꿀 수 있다 (S10 취소, 규칙 5)
--   using      = 바꾸기 전 행 조건 → 지금 '접수'인 것만
--   with check = 바꾼 뒤 행 조건  → '취소'로만
create policy "applications: 접수 상태만 취소"
  on public.applications for update
  to authenticated
  using      (user_id = (select auth.uid()) and status = '접수')
  with check (user_id = (select auth.uid()) and status = '취소');
