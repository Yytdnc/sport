/* community-view.html: 게시글 상세 + 댓글 */
(function () {
  const viewEl = document.getElementById("board-view");
  if (!viewEl) return;

  const commentListEl = document.getElementById("comment-list");
  const commentCountEl = document.getElementById("comment-count");
  const commentForm = document.getElementById("comment-form");
  const commentContent = document.getElementById("comment-content");
  const commentError = document.getElementById("comment-error");

  if (typeof sbClient === "undefined" || !sbClient) {
    viewEl.innerHTML = `<p style="color:var(--text-soft);">게시판 연결에 문제가 있어요.</p>`;
    return;
  }

  const params = new URLSearchParams(location.search);
  const postId = Number(params.get("id"));

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }
  function nl2br(escaped) {
    return escaped.replace(/\n/g, "<br>");
  }
  function fmtDate(iso) {
    return iso.slice(0, 16).replace("T", " ");
  }
  function nickOf(email) {
    return escapeHTML((email || "").split("@")[0]);
  }

  async function loadPost() {
    if (!postId) {
      viewEl.innerHTML = `<p style="color:var(--text-soft);">잘못된 게시글이에요.</p>`;
      return;
    }

    const { data: post, error } = await sbClient.from("community_posts").select("*").eq("id", postId).single();
    if (error || !post) {
      viewEl.innerHTML = `<p style="color:var(--text-soft);">게시글을 찾을 수 없어요.</p>`;
      return;
    }

    sbClient.rpc("increment_post_views", { p_id: postId });

    viewEl.innerHTML = `
      <div class="board-view-head">
        <h2>${escapeHTML(post.title)}</h2>
        <div class="board-view-meta">
          <span>${nickOf(post.author_email)}</span>
          <span>${fmtDate(post.created_at)}</span>
          <span>조회 ${post.views + 1}</span>
        </div>
      </div>
      <div class="board-view-body">${nl2br(escapeHTML(post.content))}</div>
      <div class="board-view-actions" id="board-view-actions"></div>
    `;

    const { data: sessionData } = await sbClient.auth.getSession();
    const session = sessionData.session;
    if (session && session.user.id === post.author_id) {
      const actions = document.getElementById("board-view-actions");
      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "btn-ghost";
      delBtn.textContent = "삭제";
      delBtn.addEventListener("click", async () => {
        if (!confirm("이 글을 삭제할까요?")) return;
        await sbClient.from("community_posts").delete().eq("id", postId);
        location.href = "community.html";
      });
      actions.appendChild(delBtn);
    }

    loadComments();
  }

  async function loadComments() {
    const { data, error } = await sbClient
      .from("community_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) return;

    commentCountEl.textContent = `(${data.length})`;
    commentListEl.innerHTML =
      data
        .map(
          (c) => `
      <div class="comment-row">
        <div class="comment-meta"><span>${nickOf(c.author_email)}</span><span>${fmtDate(c.created_at)}</span></div>
        <div class="comment-body">${nl2br(escapeHTML(c.content))}</div>
      </div>
    `
        )
        .join("") || `<p style="color:var(--text-soft); font-size:0.85rem;">첫 댓글을 남겨보세요.</p>`;
  }

  commentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    commentError.hidden = true;

    const { data: sessionData } = await sbClient.auth.getSession();
    const session = sessionData.session;
    if (!session) {
      commentError.textContent = "로그인 후 댓글을 작성할 수 있어요.";
      commentError.hidden = false;
      return;
    }

    const content = commentContent.value.trim();
    if (!content) return;

    const { error } = await sbClient.from("community_comments").insert({
      post_id: postId,
      author_id: session.user.id,
      author_email: session.user.email,
      content,
    });

    if (error) {
      commentError.textContent = "댓글 등록에 실패했어요: " + error.message;
      commentError.hidden = false;
      return;
    }

    commentContent.value = "";
    loadComments();
  });

  loadPost();
})();
