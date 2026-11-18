# 결정 기록

> 게이트 G8이 이 표를 읽는다. 열 이름과 순서를 바꾸지 않는다.
> 상태: 임시(승인 전) · 확정(승인됨) · 구현 안 함

| ID | 화면 | 출처 | 항목 | 결정값 | 상태 | 근거 |
|---|---|---|---|---|---|---|
| D-S1-01 | S1 | SCREEN-SPEC.md:L13 | 라우트 | /auth · 들어오는 곳: 플로우 시작, `/` 접속 시 /auth로 보냄 | 확정 | 인터뷰 R4, 인터뷰 R5 |
| D-S1-02 | S1 | SCREEN-SPEC.md:L34 | 라우트 | /auth | 확정 | 인터뷰 R4 |
| D-S1-03 | S1 | SCREEN-SPEC.md:L37 | 구성 요소 | 본인인증 버튼 하나. 실제 연동 없음. 예시 고객 3명(기존·약정 남음 / 기존·약정 끝남 / 번호이동) 중 하나를 골라 들어감 | 확정 | 인터뷰 R1 |
| D-S1-04 | S1 | SCREEN-SPEC.md:L39 | 로그인·본인인증 지원 범위 | 본인인증만 지원(버튼 하나, 실제 연동 없음). 로그인은 만들지 않음 | 확정 | 인터뷰 R1 |
| D-S1-05 | S1 | SCREEN-SPEC.md:L42 | 기본 상태 | 본인인증 버튼과 예시 고객 3명 선택지를 표시. 기존 고객 선택 시 S3, 번호이동 선택 시 S2 | 확정 | 인터뷰 R1 |
| D-S1-06 | S1 | SCREEN-SPEC.md:L43 | 로딩 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S1-07 | S1 | SCREEN-SPEC.md:L44 | 빈 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S1-08 | S1 | SCREEN-SPEC.md:L45 | 에러 상태·본인인증 실패 처리 | 만들지 않음 (실제 연동이 없어 본인인증 실패 처리도 없음) | 구현 안 함 | 인터뷰 R3, 인터뷰 R1 |
| D-S1-09 | S1 | SCREEN-SPEC.md:L48 | 진입 경로 | 플로우 시작. `/` 접속 시 S1(/auth)로 보냄 | 확정 | 인터뷰 R5 |
| D-S2-01 | S2 | SCREEN-SPEC.md:L14 | 라우트 | /conditions | 확정 | 인터뷰 R4 |
| D-S2-02 | S2 | SCREEN-SPEC.md:L61 | 라우트 | /conditions | 확정 | 인터뷰 R4 |
| D-S2-03 | S2 | SCREEN-SPEC.md:L64 | 구성 요소 | Header Type=default(뒤로 가기 → S1) · Input 2개(월 예산, 지금 내는 요금, 금액 직접 입력) · 다음 버튼(D-S2-05) | 확정 | 인터뷰 R1, 인터뷰 R0 |
| D-S2-04 | S2 | SCREEN-SPEC.md:L66 | 입력 방식 | 금액 직접 입력 (Input 2개: 월 예산, 지금 내는 요금) | 확정 | 인터뷰 R1 |
| D-S2-05 | S2 | SCREEN-SPEC.md:L67 | 다음 버튼 문구 | BottomCTA single · Button Primary xl "다음 · 요금제 추천 보기" | 확정 | 근거 없음 · 사용자 승인 2026-11-18 |
| D-S2-06 | S2 | SCREEN-SPEC.md:L70 | 기본 상태 | Input 2개를 State=default(빈 값)로 표시하고 다음 버튼을 표시 | 확정 | docs/design.md.txt:L273 (Input 기본값 default), 인터뷰 R1 · 사용자 승인 2026-11-18 |
| D-S2-07 | S2 | SCREEN-SPEC.md:L71 | 로딩 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S2-08 | S2 | SCREEN-SPEC.md:L72 | 빈 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S2-09 | S2 | SCREEN-SPEC.md:L73 | 에러 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S2-10 | S2 | SCREEN-SPEC.md:L77 | 입력 완료 동작 | 다음 버튼 클릭 → S3(/plans). 입력값은 추천 근거로 넘김. 유효성 검사·오류 표시는 하지 않음(에러 상태 구현 안 함) | 확정 | docs/PRD.md:L74, docs/PRD.md:L90, 인터뷰 R3 · 사용자 승인 2026-11-18 |
| D-S3-01 | S3 | SCREEN-SPEC.md:L99 | Card/Plan Discount·Original·Badge·Promo·Sale | Sale=false, Promo=false, Badge=false (기본형 카드. Discount·Original 표시 안 함). Badge=false로 배지가 숨지 않으면 배지 미표시를 별도로 처리 | 확정 | docs/screens.md.txt:L32-L36 (할인·프로모션 정보 없음), docs/design.md.txt:L449-L451 · 사용자 승인 2026-11-18 |
| D-S3-02 | S3 | SCREEN-SPEC.md:L104 | 로딩 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S3-03 | S3 | SCREEN-SPEC.md:L105 | 빈 상태·추천 결과 없음 처리 | 만들지 않음 (추천 요금제는 항상 예시값 3개) | 구현 안 함 | 인터뷰 R3, docs/PRD.md:L128 |
| D-S3-04 | S3 | SCREEN-SPEC.md:L106 | 에러 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S4-01 | S4 | SCREEN-SPEC.md:L136 | 혜택 List/Row | Type=check 사용. Label·Value 제안: Label "혜택" / Value "예시 혜택" 1행 | 확정 | docs/design.md.txt:L381 (Type=check는 혜택 목록용) · Label·Value 근거 없음 · 사용자 승인 2026-11-18 |
| D-S4-02 | S4 | SCREEN-SPEC.md:L137 | 결합할인 안내 문구·금액 | 결합할인을 받으면 월 (요금제 월 요금 − 2,000)원. 예: 월 15,000원 → 월 13,000원. 금액은 예시입니다. 가입 폼에서 결합할인 '예'를 고르면 S7·S8·S9의 월 납부 금액도 같은 금액으로 보여 준다. | 확정 | 근거 없음 (docs/PRD.md:L95 는 예시값이라는 것만 명시) · 사용자 승인 2026-11-18 · 사용자 변경 2026-11-18 (요금제별 −2,000원) |
| D-S4-03 | S4 | SCREEN-SPEC.md:L138 | 약정 조건 안내 문구 | "약정 기간은 12개월 또는 24개월 중에서 고를 수 있어요." (무약정 없음) | 확정 | docs/PRD.md:L95, docs/PRD.md:L129, docs/DOMAIN.md:L27 · 사용자 승인 2026-11-18 |
| D-S4-04 | S4 | SCREEN-SPEC.md:L145 | 로딩 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S4-05 | S4 | SCREEN-SPEC.md:L146 | 빈 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S4-06 | S4 | SCREEN-SPEC.md:L147 | 에러 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S5-01 | S5 | SCREEN-SPEC.md:L186 | 로딩 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S5-02 | S5 | SCREEN-SPEC.md:L187 | 빈 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S5-03 | S5 | SCREEN-SPEC.md:L188 | 에러 상태 | 만들지 않음 (유효성 검사·오류 문구 없음) | 구현 안 함 | 인터뷰 R3 |
| D-S5-04 | S5 | SCREEN-SPEC.md:L196 | 헤더 뒤로 가기 | S4 (/plans/:planId, 선택한 요금제). 번호이동 흐름의 바로 앞 화면 | 확정 | 인터뷰 R0 |
| D-S6-01 | S6 | SCREEN-SPEC.md:L211 | 기존 고객 StepProgress | 기존 고객에게는 StepProgress를 표시하지 않음. 번호이동 고객은 Step=2 "2 / 3 · 요금제 옵션 선택" 그대로 | 확정 | docs/design.md.txt:L495 (StepProgress는 3단계 기준만 정의) · 사용자 승인 2026-11-18 |
| D-S6-02 | S6 | SCREEN-SPEC.md:L212 | 기존 고객 신청 단계 라벨 | 기존 고객에게는 단계 라벨을 표시하지 않음 (D-S6-01과 맞춤) | 확정 | 근거 없음 · 사용자 승인 2026-11-18 |
| D-S6-03 | S6 | SCREEN-SPEC.md:L216 | 약정 기간 기본 선택값 | "12개월" State=selected, "24개월" State=default | 확정 | docs/screens.md.txt:L166-L171 (원본은 각 FilterChip 그룹의 첫 칩이 selected) · 사용자 승인 2026-11-18 |
| D-S6-04 | S6 | SCREEN-SPEC.md:L218 | 결합할인 여부 기본 선택값 | "예" State=selected, "아니오" State=default | 확정 | docs/screens.md.txt:L166-L171 (원본은 각 FilterChip 그룹의 첫 칩이 selected) · 사용자 승인 2026-11-18 |
| D-S6-05 | S6 | SCREEN-SPEC.md:L222 | 예상 위약금 안내 위치·문구·금액 | 위치: S6 안. 문구 제안: "약정이 남아 있어 위약금이 발생해요" / "예상 위약금 50,000원 (예시)" | 확정 | 위치 인터뷰 R1 · 문구·금액 근거 없음 · 사용자 승인 2026-11-18 |
| D-S6-06 | S6 | SCREEN-SPEC.md:L223 | 위약금 동의 입력 | Checkbox State=default/active + 설명 텍스트. 문구 제안: "예상 위약금을 확인했고 동의합니다" | 확정 | 컴포넌트 인터뷰 R1, docs/design.md.txt:L307 · 문구 근거 없음 · 사용자 승인 2026-11-18 |
| D-S6-07 | S6 | SCREEN-SPEC.md:L225 | 선택한 옵션 List/Row 행 구성 | 약정 기간, 결합할인 여부, 유심 유형(번호이동 고객만). 가입 유형 행은 뺌 | 확정 | docs/PRD.md:L102-L103 · 사용자 승인 2026-11-18 |
| D-S6-08 | S6 | SCREEN-SPEC.md:L226 | 기존 고객 하단 단계 문구 | 기존 고객에게는 하단 단계 문구를 표시하지 않음 (D-S6-01과 맞춤) | 확정 | 근거 없음 · 사용자 승인 2026-11-18 |
| D-S6-09 | S6 | SCREEN-SPEC.md:L229 | 기존 고객 버튼 문구 | "다음 · 입력 정보 확인" | 확정 | docs/screens.md.txt:L226 (입력 정보 확인으로 가는 버튼 문구) · 사용자 승인 2026-11-18 |
| D-S6-10 | S6 | SCREEN-SPEC.md:L233 | 위약금 미동의 시 버튼 | 동의 전에는 Button State=Disabled로 표시하고 클릭해도 이동하지 않음 | 확정 | docs/PRD.md:L104, docs/design.md.txt:L267 · 사용자 승인 2026-11-18 |
| D-S6-11 | S6 | SCREEN-SPEC.md:L234 | 로딩 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S6-12 | S6 | SCREEN-SPEC.md:L235 | 빈 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S6-13 | S6 | SCREEN-SPEC.md:L236 | 에러 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S6-14 | S6 | SCREEN-SPEC.md:L246 | 헤더 뒤로 가기 | 기존 고객 → S4(/plans/:planId), 번호이동 고객 → S5(/application/personal) | 확정 | 인터뷰 R0 |
| D-S6-15 | S6 | SCREEN-SPEC.md:L253 | 가입 유형 FilterChip | 뺌 (고객 유형은 S1에서 정해짐) | 확정 | docs/PRD.md:L81, docs/PRD.md:L102-L103 · 사용자 승인 2026-11-18 |
| D-S7-01 | S7 | SCREEN-SPEC.md:L280 | 로딩 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S7-02 | S7 | SCREEN-SPEC.md:L281 | 빈 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S7-03 | S7 | SCREEN-SPEC.md:L282 | 에러 상태 | 만들지 않음 (검증 조건·오류 문구 없음) | 구현 안 함 | 인터뷰 R3 |
| D-S7-04 | S7 | SCREEN-SPEC.md:L288 | 헤더 뒤로 가기 | S6 (/application/options) | 확정 | 인터뷰 R0 |
| D-S8-01 | S8 | SCREEN-SPEC.md:L306 | 기존 고객 위약금 구분 제목 | "위약금 동의" (약정이 남은 기존 고객만) | 확정 | 근거 없음 · 사용자 승인 2026-11-18 |
| D-S8-02 | S8 | SCREEN-SPEC.md:L314 | 요금제 및 옵션 행 구성 | 요금제, 약정 기간, 결합할인 여부, 유심 유형(번호이동 고객만). 가입 유형 행은 뺌 | 확정 | docs/PRD.md:L102-L103, docs/PRD.md:L112-L113 · 사용자 승인 2026-11-18 |
| D-S8-03 | S8 | SCREEN-SPEC.md:L318 | 위약금 동의 여부 List/Row | Label "위약금 동의" / Value "동의함" | 확정 | 근거 없음 (docs/DOMAIN.md:L123 은 항목만 있음) · 사용자 승인 2026-11-18 |
| D-S8-04 | S8 | SCREEN-SPEC.md:L325 | 로딩 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S8-05 | S8 | SCREEN-SPEC.md:L326 | 빈 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S8-06 | S8 | SCREEN-SPEC.md:L327 | 에러 상태 | 만들지 않음 (신청 처리 실패 상태 없음) | 구현 안 함 | 인터뷰 R3 |
| D-S8-07 | S8 | SCREEN-SPEC.md:L336 | 헤더 뒤로 가기 | 기존 고객 → S6(/application/options), 번호이동 고객 → S7(/application/payment) | 확정 | 인터뷰 R0 |
| D-S9-01 | S9 | SCREEN-SPEC.md:L356 | '접수' 안내 문구 | "가입 신청 접수" / "가입 신청이 접수되었습니다" / "가입 신청 내용은 아래와 같습니다." | 확정 | docs/PRD.md:L117 (접수 알림 요구), 인터뷰 R1 용어 · 문구 근거 없음 · 사용자 승인 2026-11-18 |
| D-S9-02 | S9 | SCREEN-SPEC.md:L364 | 고객 유형별 신청 요약 행 구성 | 공통: 가입 유형(요금제 변경 또는 번호이동 가입), 요금제, 약정 기간, 결합할인 여부, 월 납부 금액. 번호이동 고객만: 신청자(예시 이름), 유심 유형 | 확정 | docs/DOMAIN.md:L115-L123, docs/PRD.md:L130 · 사용자 승인 2026-11-18 |
| D-S9-03 | S9 | SCREEN-SPEC.md:L365 | 변경·개통 후속 처리 안내 문구 | "실제 요금제 변경과 개통은 나중에 처리되고, 결과는 연락처로 안내됩니다." / 연락처 예시 010-0000-0000 | 확정 | docs/PRD.md:L118, docs/DOMAIN.md:L87 · 사용자 승인 2026-11-18 |
| D-S9-04 | S9 | SCREEN-SPEC.md:L370 | 로딩 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S9-05 | S9 | SCREEN-SPEC.md:L371 | 빈 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S9-06 | S9 | SCREEN-SPEC.md:L372 | 에러 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S9-07 | S9 | SCREEN-SPEC.md:L376 | S10 연결 여부 | 연결하지 않음. 플로우 종료 (S10은 주소로만 들어옴, 버튼 추가 없음) | 확정 | 인터뷰 R1 |
| D-S10-01 | S10 | SCREEN-SPEC.md:L22 | 라우트 | /applications · 들어오는 곳: 주소로만 들어옴(버튼 추가 없음) · 나가는 곳: 없음(이동 버튼 없음) | 확정 | 라우트 인터뷰 R4, 진입 인터뷰 R1 · 나가는 곳 근거 없음 · 사용자 승인 2026-11-18 |
| D-S10-02 | S10 | SCREEN-SPEC.md:L387 | 라우트 | /applications | 확정 | 인터뷰 R4 |
| D-S10-03 | S10 | SCREEN-SPEC.md:L390 | 구성 요소 | Header Type=root Title "가입 신청 내역" · 신청 1건마다 List/Row 묶음 · 접수 상태 신청에만 취소 버튼 | 확정 | 근거 없음 (기능은 docs/PRD.md:L121-L122) · 사용자 승인 2026-11-18 |
| D-S10-04 | S10 | SCREEN-SPEC.md:L392 | 취소 동작 컴포넌트·문구 | Button Type=Secondary Size=sm "취소". 상태가 '접수'인 신청에만 표시. 누르면 상태를 '취소'로 바꿈 | 확정 | 동작 docs/PRD.md:L122 · 컴포넌트·문구 근거 없음 · 사용자 승인 2026-11-18 |
| D-S10-05 | S10 | SCREEN-SPEC.md:L393 | 처리 중·완료 신청 안내 문구 | "처리 중이거나 완료된 가입 신청은 취소할 수 없어요." | 확정 | 근거 없음 (docs/DOMAIN.md:L74 는 취소 불가만 명시) · 사용자 승인 2026-11-18 |
| D-S10-06 | S10 | SCREEN-SPEC.md:L396 | 목록 표시 형식 | 신청 1건마다 List/Row Type=default 3행: 요금제 / 상태 / 접수 일시(예시 2000.01.01) | 확정 | 근거 없음 (항목은 docs/DOMAIN.md:L115-L125) · 사용자 승인 2026-11-18 |
| D-S10-07 | S10 | SCREEN-SPEC.md:L398 | 로딩 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S10-08 | S10 | SCREEN-SPEC.md:L399 | 빈 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S10-09 | S10 | SCREEN-SPEC.md:L400 | 에러 상태 | 만들지 않음 | 구현 안 함 | 인터뷰 R3 |
| D-S10-10 | S10 | SCREEN-SPEC.md:L403 | 들어오는 곳 | 주소(/applications)로만 들어옴. 버튼 추가 없음 | 확정 | 인터뷰 R1 |
| D-S10-11 | S10 | SCREEN-SPEC.md:L404 | 나가는 곳 | 없음 (이동 버튼 없음) | 확정 | 근거 없음 · 사용자 승인 2026-11-18 |
