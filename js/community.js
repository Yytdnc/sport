/* community.html: 게시판 목록 + 글쓰기 (그누보드 스타일) */
(function () {
  const listEl = document.getElementById("board-list");
  if (!listEl) return;

  const paginationEl = document.getElementById("board-pagination");
  const writeBtn = document.getElementById("btn-write");
  const writeModal = document.getElementById("write-modal");
  const writeForm = document.getElementById("write-form");
  const writeError = document.getElementById("write-error");
  const writeClose = document.getElementById("write-modal-close");
  const searchForm = document.getElementById("board-search-form");
  const searchInput = document.getElementById("board-search-input");

  if (typeof sbClient === "undefined" || !sbClient) {
    listEl.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-soft); padding:24px;">게시판 연결에 문제가 있어요.</td></tr>`;
    return;
  }

  const PAGE_SIZE = 15;
  let currentPage = 1;
  let searchTerm = "";
  let totalCount = 0;

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }

  function fmtDate(iso) {
    return iso.slice(0, 10);
  }

  function nickOf(email) {
    return escapeHTML((email || "").split("@")[0]);
  }

  async function loadPosts() {
    listEl.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-soft); padding:24px;">불러오는 중...</td></tr>`;

    let query = sbClient.from("community_posts").select("id, title, author_email, created_at, views", { count: "exact" });
    if (searchTerm) query = query.ilike("title", `%${searchTerm}%`);
    const from = (currentPage - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, count, error } = await query.order("id", { ascending: false }).range(from, to);

    if (error) {
      listEl.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-soft); padding:24px;">게시글을 불러오지 못했어요.</td></tr>`;
      paginationEl.innerHTML = "";
      return;
    }

    totalCount = count || 0;

    if (!data.length) {
      listEl.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-soft); padding:24px;">${
        searchTerm ? "검색 결과가 없어요." : "아직 등록된 글이 없어요. 첫 글을 남겨보세요!"
      }</td></tr>`;
    } else {
      listEl.innerHTML = data
        .map(
          (p, idx) => `
        <tr>
          <td class="col-no">${totalCount - from - idx}</td>
          <td class="col-title"><a href="community-view.html?id=${p.id}">${escapeHTML(p.title)}</a></td>
          <td class="col-author">${nickOf(p.author_email)}</td>
          <td class="col-date">${fmtDate(p.created_at)}</td>
          <td class="col-views">${p.views}</td>
        </tr>
      `
        )
        .join("");
    }

    renderPagination();
  }

  function renderPagination() {
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    let html = "";
    for (let i = 1; i <= totalPages; i++) {
      html += `<button type="button" class="board-page ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
    }
    paginationEl.innerHTML = html;
    paginationEl.querySelectorAll(".board-page").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentPage = Number(btn.dataset.page);
        loadPosts();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
  }

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchTerm = searchInput.value.trim();
    currentPage = 1;
    loadPosts();
  });

  function openWriteModal() {
    writeError.hidden = true;
    writeForm.reset();
    writeModal.hidden = false;
  }
  function closeWriteModal() {
    writeModal.hidden = true;
  }

  writeBtn.addEventListener("click", async () => {
    const { data } = await sbClient.auth.getSession();
    if (!data.session) {
      alert("로그인 후 글을 작성할 수 있어요.");
      const loginBtn = document.getElementById("btn-login");
      if (loginBtn) loginBtn.click();
      return;
    }
    openWriteModal();
  });
  writeClose.addEventListener("click", closeWriteModal);
  writeModal.addEventListener("click", (e) => {
    if (e.target === writeModal) closeWriteModal();
  });

  writeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    writeError.hidden = true;

    const { data: sessionData } = await sbClient.auth.getSession();
    const session = sessionData.session;
    if (!session) {
      writeError.textContent = "로그인이 필요해요.";
      writeError.hidden = false;
      return;
    }

    const title = document.getElementById("write-title").value.trim();
    const content = document.getElementById("write-content").value.trim();
    if (!title || !content) return;

    const submitBtn = writeForm.querySelector("button[type=submit]");
    submitBtn.disabled = true;

    const { error } = await sbClient.from("community_posts").insert({
      author_id: session.user.id,
      author_email: session.user.email,
      title,
      content,
    });

    submitBtn.disabled = false;

    if (error) {
      writeError.textContent = "등록에 실패했어요: " + error.message;
      writeError.hidden = false;
      return;
    }

    closeWriteModal();
    currentPage = 1;
    searchTerm = "";
    searchInput.value = "";
    loadPosts();
  });

  loadPosts();
})();
