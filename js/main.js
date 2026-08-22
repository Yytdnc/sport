/* index.html: 부상자 카드 렌더링 + 리그 필터 + 선수 사진(TheSportsDB) */
(function () {
  const STATUS_LABEL = {
    out: "결장",
    doubtful: "출전 불투명",
    questionable: "출전 미정",
    ok: "복귀",
  };

  const grid = document.getElementById("injury-grid");
  const tabs = document.querySelectorAll(".injury-tabs .league-tab");
  const updatedEl = document.getElementById("last-updated");
  if (!grid) return;

  const API_BASE = "https://www.thesportsdb.com/api/v1/json/3";
  const PHOTO_CACHE_TTL_MS = 24 * 60 * 60 * 1000;
  const photoCache = new Map(); // query -> photo URL or null (in-memory, this page load)

  function cacheGet(key) {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return undefined;
      const { at, data } = JSON.parse(raw);
      if (Date.now() - at > PHOTO_CACHE_TTL_MS) return undefined;
      return data;
    } catch (e) {
      return undefined;
    }
  }

  function cacheSet(key, data) {
    try {
      sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
    } catch (e) {
      /* storage full/unavailable - skip caching */
    }
  }

  // TheSportsDB 무료 선수 검색 API로 뉴스 기사 느낌의 선수 사진을 가져와요.
  // 못 찾으면 null을 반환하고, 카드에는 사진 없이 텍스트만 보여줘요.
  async function fetchPlayerPhoto(item) {
    if (!item.photoQuery) return null;
    const cacheKey = `sp_photo_${item.photoQuery}`;
    const cached = cacheGet(cacheKey);
    if (cached !== undefined) return cached;

    try {
      const res = await fetch(`${API_BASE}/searchplayers.php?p=${encodeURIComponent(item.photoQuery)}`);
      if (!res.ok) throw new Error("bad response");
      const data = await res.json();
      const candidates = data && data.player ? data.player : [];
      let match = candidates[0] || null;
      if (item.teamEn && candidates.length > 1) {
        const teamMatch = candidates.find(
          (p) => p.strTeam && p.strTeam.toLowerCase().includes(item.teamEn.toLowerCase())
        );
        if (teamMatch) match = teamMatch;
      }
      const photo = match ? match.strCutout || match.strThumb || null : null;
      cacheSet(cacheKey, photo);
      return photo;
    } catch (e) {
      return null;
    }
  }

  function cardHTML(item) {
    return `
      <div class="injury-card status-${item.status}" data-league="${item.league}" data-id="${item.id}">
        <div class="injury-photo" hidden></div>
        <div class="injury-card-body">
          <div class="injury-card-head">
            <span class="injury-league-badge">${item.leagueLabel}</span>
            <span class="injury-status-badge ${item.status}">${STATUS_LABEL[item.status]}</span>
            <span class="injury-updated">${item.updated} 업데이트</span>
          </div>
          <h3>${item.headline}</h3>
          <div class="team-name">${item.team} · ${item.player}</div>
          <p>${item.summary}</p>
          <div class="source-note">구단 공식 발표 및 현지 보도를 확인해 자체 정리한 정보입니다. 사진은 TheSportsDB 선수 데이터베이스에서 가져와요.</div>
        </div>
      </div>
    `;
  }

  function showPhoto(itemId, url) {
    const photoEl = grid.querySelector(`.injury-card[data-id="${itemId}"] .injury-photo`);
    if (!photoEl) return;
    const img = document.createElement("img");
    img.alt = "";
    img.loading = "lazy";
    img.src = url;
    photoEl.appendChild(img);
    photoEl.hidden = false;
  }

  function applyPhotosTo(items) {
    items.forEach((item) => {
      if (!item.photoQuery) return;

      if (photoCache.has(item.photoQuery)) {
        const cached = photoCache.get(item.photoQuery);
        if (cached) showPhoto(item.id, cached);
        return;
      }

      fetchPlayerPhoto(item).then((url) => {
        photoCache.set(item.photoQuery, url);
        // 리그 탭이 바뀌어 카드가 다시 그려졌을 수 있으니 최신 DOM 기준으로 반영해요.
        if (url) showPhoto(item.id, url);
      });
    });
  }

  function render(filterLeague) {
    const list = filterLeague === "all" ? INJURIES : INJURIES.filter((i) => i.league === filterLeague);
    grid.innerHTML = list.map(cardHTML).join("") || `<p style="color:var(--text-soft); text-align:center; padding:40px 0;">해당 리그의 최신 소식이 아직 없어요.</p>`;
    applyPhotosTo(list);
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      render(tab.dataset.league);
    });
  });

  if (updatedEl) {
    const latest = INJURIES.reduce((max, i) => (i.updated > max ? i.updated : max), "");
    updatedEl.textContent = latest;
  }

  render("all");
})();
