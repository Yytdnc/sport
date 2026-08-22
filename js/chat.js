/* 실시간 채팅 사이드바 (Supabase Realtime: postgres_changes + presence) */
(function () {
  const messagesEl = document.getElementById("chat-messages");
  if (!messagesEl) return;

  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const onlineEl = document.getElementById("chat-online-count");

  if (typeof sbClient === "undefined" || !sbClient) {
    messagesEl.innerHTML = `<p class="chat-empty">채팅 연결에 문제가 있어요.</p>`;
    return;
  }

  const HISTORY_LIMIT = 50;

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }

  function nickOf(email) {
    return escapeHTML((email || "익명").split("@")[0]);
  }

  function fmtTime(iso) {
    const d = new Date(iso);
    return d.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  }

  function isNearBottom() {
    return messagesEl.scrollHeight - messagesEl.scrollTop - messagesEl.clientHeight < 60;
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function appendMessage(msg, { scroll } = { scroll: true }) {
    const shouldScroll = scroll && isNearBottom();
    const row = document.createElement("div");
    row.className = "chat-msg";
    row.innerHTML = `<span class="nick">${nickOf(msg.author_email)}</span><span class="body">${escapeHTML(
      msg.content
    )}</span><span class="time">${fmtTime(msg.created_at)}</span>`;
    messagesEl.appendChild(row);
    if (shouldScroll) scrollToBottom();
  }

  async function loadHistory() {
    messagesEl.innerHTML = `<p class="chat-empty">불러오는 중...</p>`;
    const { data, error } = await sbClient
      .from("chat_messages")
      .select("id, author_email, content, created_at")
      .order("id", { ascending: false })
      .limit(HISTORY_LIMIT);

    if (error) {
      messagesEl.innerHTML = `<p class="chat-empty">채팅을 불러오지 못했어요.</p>`;
      return;
    }

    messagesEl.innerHTML = "";
    if (!data.length) {
      messagesEl.innerHTML = `<p class="chat-empty">아직 채팅이 없어요. 첫 메시지를 남겨보세요!</p>`;
      return;
    }
    data
      .slice()
      .reverse()
      .forEach((m) => appendMessage(m, { scroll: false }));
    scrollToBottom();
  }

  sbClient
    .channel("chat_messages_changes")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "chat_messages" },
      (payload) => {
        if (messagesEl.querySelector(".chat-empty")) messagesEl.innerHTML = "";
        appendMessage(payload.new);
      }
    )
    .subscribe();

  if (onlineEl) {
    const presenceChannel = sbClient.channel("chat_online", {
      config: { presence: { key: crypto.randomUUID ? crypto.randomUUID() : String(Math.random()) } },
    });
    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const count = Object.keys(presenceChannel.presenceState()).length;
        onlineEl.textContent = `${count.toLocaleString("ko-KR")}명 접속 중`;
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") presenceChannel.track({ at: Date.now() });
      });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const content = input.value.trim();
    if (!content) return;

    const { data: sessionData } = await sbClient.auth.getSession();
    const session = sessionData.session;
    if (!session) {
      alert("로그인 후 채팅에 참여할 수 있어요.");
      const loginBtn = document.getElementById("btn-login");
      if (loginBtn) loginBtn.click();
      return;
    }

    const submitBtn = form.querySelector("button[type=submit]");
    submitBtn.disabled = true;
    input.disabled = true;

    const { error } = await sbClient.from("chat_messages").insert({
      author_id: session.user.id,
      author_email: session.user.email,
      content,
    });

    submitBtn.disabled = false;
    input.disabled = false;

    if (!error) {
      input.value = "";
      input.focus();
    }
  });

  loadHistory();
})();
