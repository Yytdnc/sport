/* index.html: 오늘의 경기 일정 & 결과 (TheSportsDB 무료 API 연동) */
(function () {
  const API_BASE = "https://www.thesportsdb.com/api/v1/json/3";
  const CACHE_TTL_MS = 10 * 60 * 1000;

  const LEAGUES = [
    { id: "mlb", apiId: 4424, label: "MLB" },
    { id: "epl", apiId: 4328, label: "EPL" },
    { id: "laliga", apiId: 4335, label: "라리가" },
    { id: "ligue1", apiId: 4334, label: "리그앙" },
    { id: "bundesliga", apiId: 4331, label: "분데스리가" },
  ];

  const listEl = document.getElementById("score-list");
  const tabs = document.querySelectorAll(".score-league-tab");
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
        league: league.id,
        leagueLabel: league.label,
        home: e.strHomeTeam,
        away: e.strAwayTeam,
        homeScore: e.intHomeScore,
        awayScore: e.intAwayScore,
        date: e.dateEvent,
        timeLocal: e.strTimeLocal,
        timestamp: e.strTimestamp ? new Date(e.strTimestamp + "Z").getTime() : null,
      }));
    });
  }

  function statusOf(match) {
    const now = Date.now();
    if (match.timestamp) {
      if (match.homeScore != null && match.awayScore != null) return "done";
      if (match.timestamp <= now && match.timestamp > now - 4 * 60 * 60 * 1000) return "live";
      if (match.timestamp > now) return "upcoming";
      return "done";
    }
    return match.homeScore != null && match.awayScore != null ? "done" : "upcoming";
  }

  const STATUS_LABEL = { upcoming: "예정", live: "진행중", done: "종료" };

  function rowHTML(m) {
    const status = statusOf(m);
    const score =
      m.homeScore != null && m.awayScore != null
        ? `${m.homeScore} : ${m.awayScore}`
        : m.timeLocal
        ? m.timeLocal.slice(0, 5)
        : "-";
    return `
      <div class="score-row" data-league="${m.league}">
        <span class="score-league-badge">${m.leagueLabel}</span>
        <span class="score-teams">${m.home} <span class="vs">vs</span> ${m.away}</span>
        <span class="score-value">${score}</span>
        <span class="score-status ${status}">${STATUS_LABEL[status]}</span>
        <span class="score-date">${m.date}</span>
      </div>
    `;
  }

  let allMatches = [];

  function render(filterLeague) {
    const now = Date.now();
    const list = (filterLeague === "all" ? allMatches : allMatches.filter((m) => m.league === filterLeague))
      .slice()
      .sort((a, b) => {
        const ta = a.timestamp || 0;
        const tb = b.timestamp || 0;
        return Math.abs(ta - now) - Math.abs(tb - now);
      })
      .slice(0, 20);
    listEl.innerHTML =
      list.map(rowHTML).join("") ||
      `<p style="color:var(--text-soft); text-align:center; padding:24px 0;">불러올 경기 정보가 없어요.</p>`;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      render(tab.dataset.league);
    });
  });

  listEl.innerHTML = `<p style="color:var(--text-soft); text-align:center; padding:24px 0;">불러오는 중...</p>`;

  Promise.all(LEAGUES.map(loadLeague)).then((results) => {
    allMatches = results.flat();
    render("all");
  });
})();
