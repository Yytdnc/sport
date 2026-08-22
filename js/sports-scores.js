/* index.html: 오늘의 경기 일정 & 결과 (TheSportsDB 무료 API 연동, 리그별 그룹 + 날짜 탭) */
(function () {
  const API_BASE = "https://www.thesportsdb.com/api/v1/json/3";
  const CACHE_TTL_MS = 10 * 60 * 1000;

  const LEAGUES = [
    { id: "mlb", apiId: 4424, label: "MLB", flag: "⚾", sport: "baseball" },
    { id: "epl", apiId: 4328, label: "EPL", flag: "⚽", sport: "soccer" },
    { id: "laliga", apiId: 4335, label: "라리가", flag: "⚽", sport: "soccer" },
    { id: "ligue1", apiId: 4334, label: "리그앙", flag: "⚽", sport: "soccer" },
    { id: "bundesliga", apiId: 4331, label: "분데스리가", flag: "⚽", sport: "soccer" },
  ];

  const SPORTS = [
    { id: "all", label: "전체", icon: "" },
    { id: "soccer", label: "축구", icon: "⚽" },
    { id: "baseball", label: "야구", icon: "⚾" },
  ];

  const listEl = document.getElementById("score-list");
  const leagueTabs = document.querySelectorAll(".score-league-tab");
  const dateTabs = document.querySelectorAll(".date-tab");
  const sportTabsEl = document.getElementById("sport-tabs");
  if (!listEl) return;

  function cacheGet(key) {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return null;
      const { at, data } = JSON.parse(raw);
      if (Date.now() - at > CACHE_TTL_MS) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function cacheSet(key, data) {
    try {
      sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
    } catch (e) {
      /* storage full/unavailable - skip caching */
    }
  }

  function fetchJSON(url, cacheKey) {
    const cached = cacheGet(cacheKey);
    if (cached) return Promise.resolve(cached);
    return fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) cacheSet(cacheKey, data);
        return data;
      })
      .catch(() => null);
  }

  function loadLeague(league) {
    const nextUrl = `${API_BASE}/eventsnextleague.php?id=${league.apiId}`;
    const pastUrl = `${API_BASE}/eventspastleague.php?id=${league.apiId}`;
    return Promise.all([
      fetchJSON(nextUrl, `sp_next_${league.apiId}`),
      fetchJSON(pastUrl, `sp_past_${league.apiId}`),
    ]).then(([next, past]) => {
      const events = [...((past && past.events) || []), ...((next && next.events) || [])];
      return events.map((e) => ({
        id: e.idEvent,
        league: league.id,
        leagueLabel: league.label,
        leagueFlag: league.flag,
        sport: league.sport,
        home: e.strHomeTeam,
        away: e.strAwayTeam,
        homeScore: e.intHomeScore,
        awayScore: e.intAwayScore,
        date: e.dateEvent,
        timeLocal: e.strTimeLocal,
        timestamp: e.strTimestamp ? new Date(e.strTimestamp + "Z").getTime() : null,
        venue: e.strVenue || null,
        apiStatus: e.strStatus || null,
        // 실시간 세부 기록(점유율/슈팅 등)은 무료 API에 없어 아직 채워지지 않아요.
        // 데이터 소스가 생기면 { home: {...}, away: {...} } 형태로 채우면 자동으로 표시돼요.
        stats: null,
      }));
    });
  }

  function statusOf(match) {
    const now = Date.now();
    if (match.apiStatus === "FT" || match.apiStatus === "Match Finished") return "done";
    if (match.apiStatus && /^(1H|2H|HT|ET|LIVE|Q1|Q2|Q3|Q4)/.test(match.apiStatus)) return "live";
    if (match.timestamp) {
      if (match.homeScore != null && match.awayScore != null) return "done";
      if (match.timestamp <= now && match.timestamp > now - 4 * 60 * 60 * 1000) return "live";
      if (match.timestamp > now) return "upcoming";
      return "done";
    }
    return match.homeScore != null && match.awayScore != null ? "done" : "upcoming";
  }

  function dayBucket(match) {
    if (!match.date) return "today";
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const yest = new Date(today);
    yest.setDate(yest.getDate() - 1);
    const tom = new Date(today);
    tom.setDate(tom.getDate() + 1);
    if (match.date === todayStr) return "today";
    if (match.date === yest.toISOString().slice(0, 10)) return "yesterday";
    if (match.date === tom.toISOString().slice(0, 10)) return "tomorrow";
    return match.date < todayStr ? "yesterday" : "tomorrow";
  }

  function timeCellHTML(m, status) {
    if (status === "live") {
      const mins = m.timestamp ? Math.max(0, Math.round((Date.now() - m.timestamp) / 60000)) : null;
      return `<span class="live-dot"></span>${mins != null ? mins + "'" : "LIVE"}`;
    }
    if (status === "done") return "종료";
    return m.timeLocal ? m.timeLocal.slice(0, 5) : "예정";
  }

  function statsBarRow(label, homeVal, awayVal) {
    const total = homeVal + awayVal;
    const homePct = total > 0 ? Math.round((homeVal / total) * 100) : 50;
    return `
      <div class="stats-bar-row">
        <span class="stats-value home">${homeVal}</span>
        <div class="stats-bar-track">
          <span class="stats-bar-home" style="width:${homePct}%"></span>
          <span class="stats-bar-away" style="width:${100 - homePct}%"></span>
        </div>
        <span class="stats-value away">${awayVal}</span>
      </div>
      <div class="stats-label">${label}</div>
    `;
  }

  // m.stats는 현재 무료 API에 없어 항상 비어있지만, 데이터가 생기면
  // { possession: [h,a], shots: [h,a], ... } 형태로 채워 바로 보이게 하는 훅이에요.
  function statsBarsHTML(m) {
    if (!m.stats) return "";
    const rows = [
      m.stats.possession ? statsBarRow("점유율 %", m.stats.possession[0], m.stats.possession[1]) : "",
      m.stats.shots ? statsBarRow("슈팅", m.stats.shots[0], m.stats.shots[1]) : "",
      m.stats.passAccuracy ? statsBarRow("패스 정확도 %", m.stats.passAccuracy[0], m.stats.passAccuracy[1]) : "",
      m.stats.corners ? statsBarRow("코너킥", m.stats.corners[0], m.stats.corners[1]) : "",
    ].join("");
    return rows ? `<div class="stats-bars">${rows}</div>` : "";
  }

  function tickerDetailHTML(m, status) {
    const mins = m.timestamp ? Math.max(0, Math.round((Date.now() - m.timestamp) / 60000)) : null;
    const stats = statsBarsHTML(m);
    return `
      <div class="ticker-detail">
        <div class="ticker-score">
          <span class="team">${m.home}</span>
          <span class="value">${m.homeScore ?? 0} : ${m.awayScore ?? 0}</span>
          <span class="team">${m.away}</span>
        </div>
        <div class="ticker-meta">
          ${status === "live" ? `<span class="live-dot"></span>${mins != null ? mins + "' 진행 중" : "LIVE"}` : "종료"}
          ${m.venue ? ` · ${m.venue}` : ""}
        </div>
        ${stats || `<p class="stats-empty">실시간 세부 기록(점유율·슈팅 등)은 아직 제공되지 않아요.</p>`}
      </div>
    `;
  }

  function rowHTML(m) {
    const status = statusOf(m);
    const score =
      m.homeScore != null && m.awayScore != null ? `${m.homeScore} : ${m.awayScore}` : "vs";
    const expandable = status === "live" || status === "done";
    return `
      <div class="score-row-wrap">
        <div class="score-row ${status}" ${expandable ? `data-id="${m.id}" role="button" tabindex="0"` : ""}>
          <span class="score-time">${timeCellHTML(m, status)}</span>
          <span class="score-team home">${m.home}</span>
          <span class="score-value">${score}</span>
          <span class="score-team away">${m.away}</span>
        </div>
      </div>
    `;
  }

  function groupHTML(league, matches) {
    return `
      <div class="league-group" data-league="${league.id}">
        <div class="league-group-head">
          <span class="league-flag">${league.flag}</span>
          <span>${league.label}</span>
          <span class="match-count">${matches.length}경기</span>
        </div>
        <div class="league-group-body">${matches.map(rowHTML).join("")}</div>
      </div>
    `;
  }

  let allMatches = [];
  let matchesById = new Map();
  let activeLeague = "all";
  let activeDate = "today";
  let activeSport = "all";
  let expandedId = null;

  function renderSportTabs() {
    if (!sportTabsEl) return;
    const todaysMatches = allMatches.filter((m) => dayBucket(m) === activeDate);
    sportTabsEl.innerHTML = SPORTS.map((s) => {
      const count = s.id === "all" ? todaysMatches.length : todaysMatches.filter((m) => m.sport === s.id).length;
      return `
        <button type="button" class="sport-tab ${s.id === activeSport ? "active" : ""}" data-sport="${s.id}">
          ${s.icon ? `<span class="sport-icon">${s.icon}</span>` : ""}
          <span>${s.label}</span>
          <span class="sport-count">${count}</span>
        </button>
      `;
    }).join("");

    sportTabsEl.querySelectorAll(".sport-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        activeSport = tab.dataset.sport;
        activeLeague = "all";
        leagueTabs.forEach((t) => t.classList.toggle("active", t.dataset.league === "all"));
        updateLeagueTabVisibility();
        render();
      });
    });
  }

  function updateLeagueTabVisibility() {
    leagueTabs.forEach((tab) => {
      const league = LEAGUES.find((l) => l.id === tab.dataset.league);
      const visible = tab.dataset.league === "all" || activeSport === "all" || (league && league.sport === activeSport);
      tab.style.display = visible ? "" : "none";
    });
  }

  function render() {
    matchesById = new Map(allMatches.map((m) => [String(m.id), m]));

    const filtered = allMatches
      .filter((m) => dayBucket(m) === activeDate)
      .filter((m) => activeSport === "all" || m.sport === activeSport)
      .filter((m) => activeLeague === "all" || m.league === activeLeague);

    const byLeague = LEAGUES.map((league) => {
      const matches = filtered
        .filter((m) => m.league === league.id)
        .slice()
        .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      return { league, matches };
    }).filter((g) => g.matches.length > 0);

    listEl.innerHTML =
      byLeague.map((g) => groupHTML(g.league, g.matches)).join("") ||
      `<p style="color:var(--text-soft); text-align:center; padding:24px 0;">해당 조건의 경기 정보가 없어요.</p>`;

    renderSportTabs();
  }

  listEl.addEventListener("click", (e) => {
    const row = e.target.closest(".score-row[data-id]");
    if (!row) return;
    const id = row.dataset.id;
    const wrap = row.closest(".score-row-wrap");
    const existingDetail = wrap.querySelector(".ticker-detail");

    if (existingDetail) {
      existingDetail.remove();
      expandedId = null;
      return;
    }

    listEl.querySelectorAll(".ticker-detail").forEach((el) => el.remove());
    const m = matchesById.get(id);
    if (!m) return;
    expandedId = id;
    wrap.insertAdjacentHTML("beforeend", tickerDetailHTML(m, statusOf(m)));
  });

  leagueTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      leagueTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeLeague = tab.dataset.league;
      render();
    });
  });

  dateTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      dateTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      activeDate = tab.dataset.date;
      render();
    });
  });

  listEl.innerHTML = `<p style="color:var(--text-soft); text-align:center; padding:24px 0;">불러오는 중...</p>`;

  Promise.all(LEAGUES.map(loadLeague)).then((results) => {
    allMatches = results.flat();
    render();
  });
})();
