# SportPick — 부상자 정보 & 경기 스코어 사이트

MLB, EPL, 라리가, 리그앙, 분데스리가의 선수 부상 소식과 실시간 경기 일정/결과를 보여주는 사이트입니다. 순수 정적 HTML/CSS/JS로 만들어져 있어 별도 서버 없이 GitHub Pages로 바로 배포할 수 있습니다. 라이브스코어 사이트 스타일로 리그별로 묶은 경기 스코어보드와, Supabase 기반 이메일 로그인/회원가입을 제공합니다.

## 구성

```
index.html              홈 (경기 일정/결과 + 부상자 소식 + 로그인/회원가입)
community.html           커뮤니티 게시판 목록 (그누보드 스타일: 번호/제목/글쓴이/날짜/조회)
community-view.html      게시글 상세 + 댓글
privacy.html             개인정보처리방침
css/style.css             디자인 (다크 네이비 + 그린 라이브스코어 테마)
js/injury-data.js         부상자 소식 데이터 (여기만 수정하면 카드가 자동으로 추가/갱신됨)
js/main.js                부상자 카드 렌더링 + 리그 필터
js/sports-scores.js       TheSportsDB 무료 API로 경기 일정/결과를 리그별로 그룹핑해 렌더링 (어제/오늘/내일 탭)
js/supabase-config.js     Supabase 프로젝트 연결 정보 (로그인/회원가입 + 커뮤니티 DB용)
js/supabase-client.js     Supabase 클라이언트 싱글턴 (다른 스크립트가 공용으로 사용)
js/auth.js                Supabase Auth 기반 로그인/회원가입 모달 로직
js/community.js           게시판 목록 조회/검색/페이지네이션/글쓰기
js/community-view.js      게시글 상세 조회/조회수 증가/댓글 작성
supabase/schema.sql       커뮤니티 게시판용 테이블 + RLS 정책 (최초 1회 Supabase SQL Editor에서 실행)
.github/workflows/deploy.yml   GitHub Pages 자동 배포 워크플로
```

## 로그인 / 회원가입

헤더 우측 로그인·회원가입 버튼을 누르면 이메일+비밀번호 방식의 모달이 뜨고, Supabase Auth로 가입·로그인·로그아웃이 처리됩니다.

**동작시키려면 실제 anon key가 필요해요** — `js/supabase-config.js`의 `SUPABASE_ANON_KEY`가 현재 `"YOUR_SUPABASE_ANON_KEY"` 자리표시자로 되어 있어 이 상태로는 로그인/가입 요청이 실패합니다.

1. Supabase 대시보드 → 해당 프로젝트 → **Project Settings → API → Project API keys → anon public** 값을 복사
2. `js/supabase-config.js`의 `SUPABASE_ANON_KEY`에 붙여넣기
3. Supabase 대시보드 → **Authentication → Providers**에서 Email 로그인이 활성화되어 있는지 확인
4. (선택) **Authentication → Settings**에서 "Confirm email" 옵션을 켜두면 가입 후 이메일 인증 링크를 눌러야 로그인이 가능하고, 꺼두면 가입 즉시 로그인 상태가 됩니다.

## 커뮤니티 게시판 (그누보드 스타일)

`community.html`(목록) / `community-view.html`(상세+댓글)로 구성된 게시판이에요. 목록은 번호·제목·글쓴이·날짜·조회수 컬럼과 페이지네이션, 제목 검색, 글쓰기 버튼을 갖춘 고전적인 게시판 UI(그누보드 스타일)입니다. 로그인한 사용자만 글/댓글을 작성할 수 있고, 본인 글/댓글만 삭제할 수 있어요.

**동작시키려면 DB 테이블을 먼저 만들어야 해요** (로그인/회원가입과 별개로 한 번 더 필요한 설정입니다):

1. Supabase 대시보드 → 해당 프로젝트 → **SQL Editor** → **New query**
2. 이 저장소의 `supabase/schema.sql` 내용을 그대로 붙여넣고 실행 (`community_posts`, `community_comments` 테이블과 RLS 정책, 조회수 증가 함수가 한 번에 생성됩니다)
3. 위 "로그인 / 회원가입"에서 안내한 대로 `SUPABASE_ANON_KEY`가 실제 값으로 채워져 있는지 확인

게시글 작성자 표시는 이메일 전체가 아니라 `@` 앞부분(아이디)만 노출됩니다.

## 부상자 소식 추가/수정하는 법

`js/injury-data.js`의 `INJURIES` 배열에 항목을 추가하면 홈 화면에 자동으로 반영됩니다.

```js
{
  id: "mlb-judge-rib",           // 고유 id
  league: "mlb",                  // mlb | epl | laliga | ligue1 | bundesliga
  leagueLabel: "MLB",
  team: "뉴욕 양키스",
  player: "애런 저지",
  status: "doubtful",             // out(결장 확정) | doubtful(출전 불투명) | questionable(출전 미정) | ok(복귀)
  updated: "2026-08-20",          // YYYY-MM-DD
  headline: "짧은 헤드라인",
  summary: "2~3문장 요약",
}
```

**중요**: 모든 항목은 구단 공식 발표·현지 언론 보도를 확인한 뒤 자체적으로 요약/재작성한 내용이어야 합니다. 특정 기사의 문장을 그대로 옮기지 말고, 확인된 사실(팩트)만 반영해 새로 작성해주세요.

## 실시간 경기 일정 & 결과

`js/sports-scores.js`가 [TheSportsDB](https://www.thesportsdb.com) 무료 공개 API(테스트 키 `3`, 별도 발급 불필요)로 5개 리그의 직전 결과·다음 일정을 가져와 홈 화면 상단에 보여줍니다.

- 리그별 API ID는 스크립트 상단 `LEAGUES` 배열에서 관리합니다.
- 요청 결과는 `sessionStorage`에 10분간 캐시해서 같은 세션 내 재요청을 줄입니다.
- 무료 API에는 부상자(injury) 데이터가 없어서, 부상자 소식은 위 방식대로 계속 수동으로 관리합니다.
- 경기 상태(예정/진행중/종료)는 API가 주는 스코어·시간 값을 기준으로 클라이언트에서 추정하는 방식이라, 아주 드물게 실제 상태와 몇 분 정도 어긋날 수 있습니다.

## 캐시 무효화 (`?v=`)

배포 후에도 CDN/브라우저가 `js/*.js`·`css/*.css`를 예전 버전으로 캐싱할 수 있습니다. 이를 방지하기 위해 모든 `<script src="js/...">`/`<link href="css/...">`에 `?v=1` 같은 버전 쿼리스트링을 붙여뒀습니다.

**`js/` 또는 `css/` 안의 파일을 수정했다면, `index.html` / `privacy.html` / `community.html` / `community-view.html`에서 해당 파일을 가리키는 `?v=` 번호를 하나 올려주세요** (예: `?v=2` → `?v=3`). 파일마다 버전 번호를 독립적으로 관리하므로, 수정한 파일의 쿼리스트링만 올리면 됩니다.

## 로컬 확인

정적 파일이라 아무 웹서버로 열면 됩니다.

```bash
python3 -m http.server 8080
# 브라우저에서 http://localhost:8080 접속
```

## GitHub Pages 자동 배포

`.github/workflows/deploy.yml`이 `main` 브랜치에 푸시될 때마다 자동으로 GitHub Pages에 배포합니다.

최초 1회, 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정해주세요. 이후에는 `git push`만 하면 자동으로 사이트가 갱신됩니다.

`index.html`/`privacy.html`의 canonical/OG URL은 `https://www.sportpick.net/`을 가리키고 있지만, 아직 커스텀 도메인(CNAME)이 연결되어 있지 않습니다. 실제 도메인을 붙이려면 저장소 루트에 `CNAME` 파일을 추가하고 DNS를 설정해주세요.

## Supabase 연동

`js/supabase-config.js`의 연결 정보(URL + anon key)로 `js/auth.js`가 로그인/회원가입을 처리합니다 (위 "로그인 / 회원가입" 항목 참고). 경기별 실시간 응원톡 같은 추가 기능도 같은 설정으로 붙일 수 있습니다.

- anon key는 공개되어도 되는 키입니다 (RLS 정책이 실제 접근 권한을 통제).
- service_role 키는 절대 프론트엔드 코드에 넣지 마세요.

## 참고

- 본 사이트의 모든 정보는 참고용이며 실시간 정확성을 보장하지 않습니다. 베팅·도박을 권유하거나 중개하지 않습니다.
- 개인정보처리방침 페이지(`privacy.html`)는 실제 운영 시 연락처 등 내용을 보완하세요.
