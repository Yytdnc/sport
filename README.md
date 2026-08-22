# 데일리스코어 — 부상자 정보 & 라이브 스코어

MLB·EPL·라리가·리그앙·분데스리가 부상자 소식과, 다종목 라이브 스코어보드를 제공하는 사이트입니다. Next.js(App Router, TypeScript)로 만들어져 있고, 로그인/회원가입/실시간 채팅/커뮤니티는 Supabase를 사용합니다.

## 구성

```
src/app/
  page.tsx                      홈 (부상자 소식 + 라이브 스코어보드)
  layout.tsx                     공통 레이아웃 (헤더/푸터/폰트/AuthProvider)
  globals.css                    디자인 시스템 (다크 네이비 + 그린 라이브스코어 테마)
  privacy/page.tsx               개인정보처리방침
  community/page.tsx             커뮤니티 게시판 목록
  community/[id]/page.tsx        게시글 상세 + 댓글
  api/scores/soccer/route.ts     축구 스코어 API (API-FOOTBALL 프록시 + 캐시)
  api/scores/[sport]/route.ts    야구/농구/배구/하키 스코어 API (TheSportsDB 프록시)

src/components/
  layout/                        Header, Footer
  auth/                          AuthProvider(세션 컨텍스트), AuthModal
  home/Hero.tsx
  injuries/InjurySection.tsx     부상자 카드 + 리그 필터 + 선수 사진(TheSportsDB)
  community/                     CommunityList(목록+글쓰기), CommunityView(상세+댓글)
  chat/                          ChatPanel(Supabase Realtime), FloatingChatBubble
  scores/                        라이브 스코어보드 전체 UI (아래 "라이브 스코어" 참고)

src/lib/
  types.ts                       Match/League 등 공통 타입, 지원 종목 메타
  injuries.ts                    부상자 소식 데이터 (여기만 수정하면 카드가 자동 반영)
  supabase/client.ts             Supabase 클라이언트 싱글턴
  scores/leagues.ts               TheSportsDB 리그 ID, 인기 리그 이름 목록
  scores/api-football.ts          API-FOOTBALL 연동 + 서버 캐시 (축구)
  scores/thesportsdb.ts           TheSportsDB 연동 + 서버 캐시 (야구/농구/배구/하키)
  scores/aggregate.ts             홈 페이지 최초 렌더용 전 종목 동시 조회
  scores/utils.ts                 날짜 계산/포맷 유틸

supabase/schema.sql              커뮤니티 게시판 + 채팅 테이블/RLS (최초 1회 실행)
```

## 실행

```bash
npm install
npm run dev
# http://localhost:3000
```

배포는 API 라우트(서버 캐시 포함)를 실제로 실행할 수 있는 Node 호스팅이 필요합니다 — **Vercel**이 가장 쉽습니다(Next.js 공식 호스팅, 환경변수 UI 제공). GitHub Pages 등 정적 호스팅으로는 배포할 수 없어 기존 `.github/workflows/deploy.yml`(GitHub Pages용)은 제거했습니다.

## 환경변수 (`.env.local`)

`.env.local.example`을 복사해서 `.env.local`을 만들고 값을 채워주세요.

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
API_FOOTBALL_KEY=...
```

- Supabase 값은 기존 프로젝트 값이 이미 `.env.local`에 채워져 있습니다(anon key는 공개돼도 되는 키 — RLS가 실제 접근 권한을 통제).
- **`API_FOOTBALL_KEY`는 아직 비어 있어요.** [dashboard.api-football.com/register](https://dashboard.api-football.com/register)에서 무료 플랜으로 가입하면 발급받을 수 있습니다. 키가 없어도 사이트는 정상 동작하고, 축구 탭에는 "API 키가 설정되지 않았어요" 안내만 표시됩니다.

## 라이브 스코어

축구(⚽)/야구(⚾)/농구(🏀)/배구(🏐)/하키(🏒) 5개 종목은 실제 데이터가 연동돼 있고, e스포츠/UFC/테니스/골프/F1은 아직 연동된 데이터 소스가 없어 "준비 중" 상태로만 표시됩니다(가짜 경기 데이터를 넣지 않았어요).

### 축구 — API-FOOTBALL (무료 플랜: 하루 100회 제한)

`src/lib/scores/api-football.ts`가 `v3.football.api-sports.io/fixtures?date=YYYY-MM-DD` 한 번 호출로 그날 전 세계 모든 리그의 경기를 가져옵니다. **서버 사이드 공유 캐시**(`unstable_cache`, 15분)가 걸려 있어 방문자가 몇 명이든, 클라이언트가 몇 번을 요청하든 실제 업스트림 호출은 하루 최대 약 96회로 제한됩니다 — 이 캐시를 우회하거나 캐시 시간을 대폭 줄이면 무료 쿼터를 바로 소진하니 주의하세요.

### 야구/농구/배구/하키 — TheSportsDB (무료, 테스트 키 `3`)

`src/lib/scores/thesportsdb.ts` + `src/lib/scores/leagues.ts`. 종목별로 실제 이벤트가 있는 리그 ID를 큐레이션해뒀습니다(MLB 4424, NBA 4387, NHL 4380, 벨기에 프로배구 5617). 이 API는 무료 플랜에 진짜 실시간 상태값이 없어서, 킥오프 시각 기준 4시간 이내면 "진행 중"으로 추정하는 방식(기존 로직 그대로)을 씁니다 — 실제 상태와 몇 분 어긋날 수 있어요.

### e스포츠/UFC/테니스/골프/F1

탭 UI는 만들어뒀지만 연동된 무료 데이터 소스가 없습니다. 필요하면 API-SPORTS의 다른 종목별 API나 Sportradar 같은 유료 API를 추가로 붙이는 걸 검토해보세요.

## 로그인 / 회원가입 / 실시간 채팅

헤더의 로그인·회원가입 버튼과 우측 하단 채팅 버블은 모두 Supabase Auth/Realtime을 사용합니다(`src/components/auth`, `src/components/chat`). 이메일 인증(Confirm email) 여부는 Supabase 대시보드 **Authentication → Settings**에서 설정합니다.

## 커뮤니티 게시판

`supabase/schema.sql`을 Supabase SQL Editor에서 한 번 실행하면 `community_posts`/`community_comments`/`chat_messages` 테이블과 RLS 정책이 모두 생성됩니다. 로그인한 사용자만 글/댓글 작성이 가능하고 본인 글/댓글만 삭제할 수 있습니다. 작성자 표시는 이메일 `@` 앞부분만 노출됩니다.

## 부상자 소식 추가/수정

`src/lib/injuries.ts`의 `INJURIES` 배열에 항목을 추가하면 홈 화면에 자동 반영됩니다. 모든 항목은 구단 공식 발표·현지 언론 보도를 확인한 뒤 자체적으로 요약/재작성한 내용이어야 합니다.

## 참고

- 본 사이트의 모든 정보는 참고용이며 실시간 정확성을 보장하지 않습니다. 베팅·도박을 권유하거나 중개하지 않습니다.
- 개인정보처리방침(`src/app/privacy/page.tsx`)은 실제 운영 시 연락처 등 내용을 보완하세요.
