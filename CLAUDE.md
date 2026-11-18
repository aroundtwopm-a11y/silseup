# 화면 구현 하네스 — 오케스트레이터 규칙

@AGENTS.md

## 1. 메인 대화가 하는 일
- 메인 대화는 직접 구현하지 않는다. `app/`, `components/`, `harness/decisions/`의 파일을 직접 쓰거나 고치지 않는다.
- 하는 일은 세 가지뿐이다: 에이전트 부르기, 게이트 돌리기, 단계 커밋과 `harness/progress.json` 기록.
- `docs/`와 `reference/`는 읽기만 한다.

## 2. 부르는 말
| 부르는 말 | 하는 일 |
|---|---|
| "S3 만들어줘", "S5~S7 만들어줘" | 그 화면으로 2단계부터 진행한다. 승인 지점에서 멈춘다 |
| "결정 승인" | decision-recorder를 승인 모드로 불러 decisions.md의 "임시"를 "확정"으로 바꾸고, 3·4·5단계를 진행한다 |
| "이어서 해줘" | progress.json에서 done이 아닌 첫 단계부터 진행한다 |
| "S3 검증해줘" | 5단계만 실행한다 |
| "공용 컴포넌트 만들어줘" | 3단계만 실행한다 |

## 3. 파이프라인
| # | 단계 | 담당 | 편집 폴더 | 넘어가는 조건 | 커밋 |
|---|---|---|---|---|---|
| 1 | PRD 읽기 | docs-one-pager 스킬 | ONE-PAGER.md | 파일이 있으면 건너뜀 | — |
| 2 | 페이지 나누기 | screen-spec → decision-recorder | SCREEN-SPEC.md / harness/decisions/ | `npm run gate -- S3 --stage 2` 통과 (G8) | harness(S3): 2-spec |
| ⛔ | 사람 승인 | 사용자 | — | 사용자가 직접 "결정 승인"이라고 함. 승인 전에는 3단계 이후를 진행하지 않는다 | — |
| 3 | 토큰 적용 | token-builder | components/ui/ | `npm run tokens` 후 `npm run gate -- --stage 3` 통과 (G2·G3·G11·G12). done이면 건너뜀 | harness(common): 3-tokens |
| 4 | 화면 구현 | screen-builder | app/ | — | harness(S3): 4-implement |
| 5 | 검증 | gate-judge (읽기 전용) | 없음 | `npm run gate -- S3` 전부 통과 | harness(S3): 5-verify |

- 단계 하나가 끝날 때마다 1커밋하고, 같은 커밋에서 progress.json을 갱신한다.
- `SCREEN-SPEC.md`가 이미 있으면 screen-spec은 멈추고 보고한다. 그때는 있는 파일을 그대로 쓰고 decision-recorder로 넘어간다.
- 5단계 보고서(`harness/reports/`)는 게이트 스크립트가 쓴다. 5-verify 커밋에 함께 넣는다.

## 4. 게이트 (모두 통과해야 완료)
| # | 통과 조건 | 실패 시 |
|---|---|---|
| G1 | 구현된 화면 수 = 라우트 수, 표에 없는 라우트 0개 | 4단계 |
| G2 | 토큰 밖 값 0개 (훅이 쓰기 직전에 거부) | 3 또는 4단계 |
| G3 | app/ 안에서 design.md 컴포넌트를 다시 정의한 것 0개, components/ui 목록 일치 | 4 또는 3단계 |
| G4 ★ | 기존 고객 흐름에 S5·S7 0회, 기존 고객 S6에 유심 FilterChip 0개 | 4단계 |
| G5 ★ | 약정이 남은 고객이 동의하지 않으면 S6 CTA 비활성, S8 이동 0회 | 4단계 |
| G6 | S3 카드 3개, 약정 선택지는 {12, 24}뿐, "무약정" 0회 | 4단계 |
| G7 | '가입' 없이 쓴 '신청' 0회 | 4단계 |
| G8 | 결정 ID가 없는 "확인 필요" 0개 | 2단계에서 멈추고 묻는다 |
| G9 | 흐름이 PRD 5.1과 같음, 뒤로 가기 = 바로 앞 단계 | 4단계 |
| G10 | 예시값이 아닌 전화번호·이메일 모양의 값 0개 | 4단계 |
| G11 | tsc·lint·build 에러 0개 | 위반이 난 단계 |
| G12 | 단계 커밋에서 그 에이전트 폴더 밖 변경 0개 | 그 단계 |

## 5. 실패 처리
- gate-judge가 알려 준 단계의 에이전트를 실패 이유와 함께 다시 부른다.
- 같은 화면에서 같은 게이트가 3번 실패하면 멈추고 사용자에게 보고한다.
- 2단계로 돌아가야 하면(명세 오류) 고치지 말고 멈춘 뒤 사용자에게 묻는다.

## 6. 지킬 것
- 근거 우선순위: PRD > screens > 피그마 화면 링크 > Make 링크(흐름만) > flow.png
- 토큰은 `docs/token.json.txt` 하나만 기준으로 쓴다. 그 밖의 값은 쓰지 않는다.
- "확인 필요" 항목은 decisions.md에 "확정" ID가 있을 때만 구현한다. 지어내지 않는다.
- 로딩·빈·에러 상태는 만들지 않는다(결정: 구현 안 함).
- 화면 문구는 '가입'으로 통일한다.
- 예시 데이터에는 정해 둔 예시값만 쓴다. 고객 개인정보는 넣지 않는다.
- 에이전트는 `harness/scripts/`, `harness/tests/`, `.claude/`를 고치지 않는다.
- push는 사용자가 요청할 때만 한다.

## 7. 이어 하기 (progress.json)
```json
{ "common": { "3-tokens": "done" },
  "S3": { "2-spec": "done", "approved": true, "4-implement": "done", "5-verify": "pending" } }
```
