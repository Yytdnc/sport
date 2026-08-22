# SportPick — 부상자 정보 & 경기 스코어 사이트

MLB, EPL, 라리가, 리그앙, 분데스리가의 선수 부상 소식과 실시간 경기 일정/결과를 보여주는 사이트입니다. 순수 정적 HTML/CSS/JS로 만들어져 있어 별도 서버 없이 GitHub Pages로 바로 배포할 수 있습니다.

## 구성

```
index.html              홈 (경기 일정/결과 + 부상자 소식)
privacy.html             개인정보처리방침
css/style.css             디자인 (다크 테마)
js/injury-data.js         부상자 소식 데이터 (여기만 수정하면 카드가 자동으로 추가/갱신됨)
js/main.js                부상자 카드 렌더링 + 리그 필터
js/sports-scores.js       TheSportsDB 무료 API로 경기 일정/결과를 가져와 렌더링
js/supabase-config.js     Supabase 프로젝트 연결 정보 (라이브 응원톡 기능 준비용, 아직 화면에 연결되지 않음)
.github/workflows/deploy.yml   GitHub Pages 자동 배포 워크플로
```

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

**`js/` 또는 `css/` 안의 파일을 수정했다면, `index.html`과 `privacy.html`에서 해당 파일을 가리키는 `?v=` 번호를 하나 올려주세요** (예: `?v=2` → `?v=3`). 파일마다 버전 번호를 독립적으로 관리하므로, 수정한 파일의 쿼리스트링만 올리면 됩니다.

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

## Supabase 연동 (라이브 응원톡, 준비 중)

`js/supabase-config.js`에 Supabase 프로젝트 연결 정보(URL + anon key)가 준비되어 있지만, 아직 어떤 페이지에서도 실제로 불러오거나 사용하지 않습니다. 경기별 실시간 응원톡 같은 기능을 붙일 때 이 설정을 사용하면 됩니다.

- anon key는 공개되어도 되는 키입니다 (RLS 정책이 실제 접근 권한을 통제).
- service_role 키는 절대 프론트엔드 코드에 넣지 마세요.

## 참고

- 본 사이트의 모든 정보는 참고용이며 실시간 정확성을 보장하지 않습니다. 베팅·도박을 권유하거나 중개하지 않습니다.
- 개인정보처리방침 페이지(`privacy.html`)는 실제 운영 시 연락처 등 내용을 보완하세요.
