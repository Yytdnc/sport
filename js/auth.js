/* 로그인 / 회원가입 (Supabase Auth 이메일 로그인) */
(function () {
  if (typeof sbClient === "undefined" || !sbClient) return;

  const client = sbClient;

  const authArea = document.getElementById("auth-area");
  const modal = document.getElementById("auth-modal");
  const modalTitle = document.getElementById("auth-modal-title");
  const modalSub = document.getElementById("auth-modal-sub");
  const tabs = document.querySelectorAll(".modal-tab");
  const form = document.getElementById("auth-form");
  const emailInput = document.getElementById("auth-email");
  const passwordInput = document.getElementById("auth-password");
  const submitBtn = document.getElementById("auth-submit");
  const errorEl = document.getElementById("auth-error");
  const infoEl = document.getElementById("auth-info");
  const closeBtn = document.getElementById("modal-close");

  if (!authArea || !modal) return;

  let mode = "login";

  const COPY = {
    login: { title: "로그인", sub: "SportPick 계정으로 로그인하세요.", submit: "로그인" },
    signup: { title: "회원가입", sub: "이메일과 비밀번호(6자 이상)로 가입해요.", submit: "회원가입" },
  };

  function resetMessages() {
    errorEl.hidden = true;
    infoEl.hidden = true;
    errorEl.textContent = "";
    infoEl.textContent = "";
  }

  function setMode(next) {
    mode = next;
    tabs.forEach((t) => t.classList.toggle("active", t.dataset.mode === mode));
    modalTitle.textContent = COPY[mode].title;
    modalSub.textContent = COPY[mode].sub;
    submitBtn.textContent = COPY[mode].submit;
    resetMessages();
  }

  function openModal(initialMode) {
    setMode(initialMode || "login");
    modal.hidden = false;
    emailInput.focus();
  }

  function closeModal() {
    modal.hidden = true;
    form.reset();
    resetMessages();
  }

  tabs.forEach((t) => t.addEventListener("click", () => setMode(t.dataset.mode)));
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  const AUTH_ERROR_KO = {
    "Invalid login credentials": "이메일 또는 비밀번호가 올바르지 않아요.",
    "User already registered": "이미 가입된 이메일이에요.",
    "Password should be at least 6 characters": "비밀번호는 6자 이상이어야 해요.",
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    resetMessages();
    submitBtn.disabled = true;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    try {
      if (mode === "signup") {
        const { data, error } = await client.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) {
          closeModal();
        } else {
          infoEl.textContent = "가입 확인 이메일을 보냈어요. 메일함을 확인해주세요.";
          infoEl.hidden = false;
        }
      } else {
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        closeModal();
      }
    } catch (err) {
      errorEl.textContent = AUTH_ERROR_KO[err.message] || err.message || "문제가 발생했어요. 다시 시도해주세요.";
      errorEl.hidden = false;
    } finally {
      submitBtn.disabled = false;
    }
  });

  function renderAuthArea(session) {
    if (session && session.user) {
      authArea.className = "auth-area logged-in";
      authArea.innerHTML = `
        <span class="user-chip"><span class="material-symbols-outlined">account_circle</span><span>${session.user.email}</span></span>
        <button type="button" class="btn-ghost" id="btn-logout">로그아웃</button>
      `;
      document.getElementById("btn-logout").addEventListener("click", () => client.auth.signOut());
    } else {
      authArea.className = "auth-area";
      authArea.innerHTML = `
        <button type="button" class="btn-ghost" id="btn-login">로그인</button>
        <button type="button" class="btn-accent" id="btn-signup">회원가입</button>
      `;
      document.getElementById("btn-login").addEventListener("click", () => openModal("login"));
      document.getElementById("btn-signup").addEventListener("click", () => openModal("signup"));
    }
  }

  client.auth.getSession().then(({ data }) => renderAuthArea(data.session));
  client.auth.onAuthStateChange((_event, session) => renderAuthArea(session));
})();
