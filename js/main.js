/* index.html: 부상자 카드 렌더링 + 리그 필터 */
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

  function cardHTML(item) {
    return `
      <div class="injury-card status-${item.status}" data-league="${item.league}">
        <div class="injury-card-head">
          <span class="injury-league-badge">${item.leagueLabel}</span>
          <span class="injury-status-badge ${item.status}">${STATUS_LABEL[item.status]}</span>
          <span class="injury-updated">${item.updated} 업데이트</span>
        </div>
        <h3>${item.headline}</h3>
        <div class="team-name">${item.team} · ${item.player}</div>
        <p>${item.summary}</p>
        <div class="source-note">구단 공식 발표 및 현지 보도를 확인해 자체 정리한 정보입니다. 실시간 최신 상태와 다를 수 있어요.</div>
      </div>
    `;
  }

  function render(filterLeague) {
    const list = filterLeague === "all" ? INJURIES : INJURIES.filter((i) => i.league === filterLeague);
    grid.innerHTML = list.map(cardHTML).join("") || `<p style="color:var(--text-soft); text-align:center; padding:40px 0;">해당 리그의 최신 소식이 아직 없어요.</p>`;
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
