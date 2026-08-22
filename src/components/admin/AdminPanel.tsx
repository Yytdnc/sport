"use client";

import { FormEvent, useEffect, useState } from "react";

type Kind = "team" | "league" | "country";

interface OverrideRow {
  id: number;
  kind: Kind;
  original_name: string;
  country: string | null;
  korean_name: string;
  created_at: string;
}

const KIND_LABEL: Record<Kind, string> = { team: "팀명", league: "리그명", country: "국가명" };

interface VisibilityRow {
  id: number;
  country: string;
  league_name: string;
  hidden: boolean;
  priority: number | null;
  created_at: string;
}

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setError(data.error ?? "로그인에 실패했어요.");
        return;
      }
      onSuccess();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal" style={{ maxWidth: 340, margin: "60px auto" }}>
      <h3>Admin 로그인</h3>
      <form onSubmit={handleSubmit}>
        <label>
          아이디
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          비밀번호
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" className="btn-accent full" disabled={submitting}>
          로그인
        </button>
      </form>
    </div>
  );
}

function ManagementPanel() {
  const [rows, setRows] = useState<OverrideRow[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [kind, setKind] = useState<Kind>("team");
  const [originalName, setOriginalName] = useState("");
  const [country, setCountry] = useState("");
  const [koreanName, setKoreanName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadRows() {
    const res = await fetch("/api/admin/overrides");
    const data = (await res.json()) as { ok: boolean; rows: OverrideRow[]; error?: string };
    if (!data.ok) setLoadError(data.error ?? "불러오지 못했어요.");
    else setLoadError(null);
    setRows(data.rows ?? []);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRows();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!originalName.trim() || !koreanName.trim()) return;

    setSubmitting(true);
    const res = await fetch("/api/admin/overrides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind,
        originalName: originalName.trim(),
        country: kind === "league" ? country.trim() || undefined : undefined,
        koreanName: koreanName.trim(),
      }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string };
    setSubmitting(false);

    if (!data.ok) {
      setFormError(data.error ?? "저장에 실패했어요.");
      return;
    }
    setOriginalName("");
    setCountry("");
    setKoreanName("");
    loadRows();
  }

  async function handleDelete(id: number) {
    if (!confirm("이 오버라이드를 삭제할까요?")) return;
    await fetch(`/api/admin/overrides?id=${id}`, { method: "DELETE" });
    loadRows();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    location.reload();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontFamily: "var(--font-display)" }}>팀/리그명 번역 관리</h1>
        <button type="button" className="btn-ghost" onClick={handleLogout}>
          로그아웃
        </button>
      </div>

      {loadError && <p className="auth-error">{loadError}</p>}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "flex-end",
          background: "var(--surface-elevated)",
          border: "1px solid var(--border-technical)",
          borderRadius: "var(--radius-md)",
          padding: 16,
          marginBottom: 20,
        }}
      >
        <label style={{ fontSize: "0.78rem", color: "var(--text-soft)" }}>
          종류
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as Kind)}
            style={{
              display: "block",
              marginTop: 6,
              padding: "9px 10px",
              background: "var(--surface-2)",
              border: "1px solid var(--border-technical)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text)",
            }}
          >
            <option value="team">팀명</option>
            <option value="league">리그명</option>
            <option value="country">국가명</option>
          </select>
        </label>
        <label style={{ fontSize: "0.78rem", color: "var(--text-soft)", flex: "1 1 160px" }}>
          원문 이름 (영문, API 표기 그대로)
          <input value={originalName} onChange={(e) => setOriginalName(e.target.value)} required />
        </label>
        {kind === "league" && (
          <label style={{ fontSize: "0.78rem", color: "var(--text-soft)", flex: "1 1 120px" }}>
            국가 (영문, 선택 — 비우면 모든 국가에 적용)
            <input value={country} onChange={(e) => setCountry(e.target.value)} />
          </label>
        )}
        <label style={{ fontSize: "0.78rem", color: "var(--text-soft)", flex: "1 1 140px" }}>
          한글 표기
          <input value={koreanName} onChange={(e) => setKoreanName(e.target.value)} required />
        </label>
        <button type="submit" className="btn-accent" disabled={submitting}>
          저장
        </button>
      </form>
      {formError && <p className="auth-error">{formError}</p>}

      <div className="board-table-wrap">
        <table className="board-table">
          <thead>
            <tr>
              <th>종류</th>
              <th className="col-title">원문</th>
              <th>국가</th>
              <th className="col-title">한글 표기</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {rows === null ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 24 }}>
                  불러오는 중...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 24, color: "var(--text-soft)" }}>
                  아직 등록된 오버라이드가 없어요.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td>{KIND_LABEL[row.kind]}</td>
                  <td className="col-title">{row.original_name}</td>
                  <td>{row.country ?? "-"}</td>
                  <td className="col-title">{row.korean_name}</td>
                  <td>
                    <button type="button" className="btn-ghost" onClick={() => handleDelete(row.id)}>
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeagueVisibilityPanel() {
  const [rows, setRows] = useState<VisibilityRow[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [country, setCountry] = useState("");
  const [leagueName, setLeagueName] = useState("");
  const [hidden, setHidden] = useState(true);
  const [priority, setPriority] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function loadRows() {
    const res = await fetch("/api/admin/league-visibility");
    const data = (await res.json()) as { ok: boolean; rows: VisibilityRow[]; error?: string };
    if (!data.ok) setLoadError(data.error ?? "불러오지 못했어요.");
    else setLoadError(null);
    setRows(data.rows ?? []);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRows();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!country.trim() || !leagueName.trim()) return;

    setSubmitting(true);
    const res = await fetch("/api/admin/league-visibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        country: country.trim(),
        leagueName: leagueName.trim(),
        hidden,
        priority: priority.trim() ? Number(priority) : null,
      }),
    });
    const data = (await res.json()) as { ok: boolean; error?: string };
    setSubmitting(false);

    if (!data.ok) {
      setFormError(data.error ?? "저장에 실패했어요.");
      return;
    }
    setCountry("");
    setLeagueName("");
    setHidden(true);
    setPriority("");
    loadRows();
  }

  async function handleDelete(id: number) {
    if (!confirm("이 설정을 삭제할까요? (삭제하면 해당 리그는 다시 기본 규칙대로 표시돼요)")) return;
    await fetch(`/api/admin/league-visibility?id=${id}`, { method: "DELETE" });
    loadRows();
  }

  return (
    <div style={{ marginTop: 40 }}>
      <h2 style={{ fontFamily: "var(--font-display)", marginBottom: 12 }}>리그 표시 관리</h2>
      <p style={{ color: "var(--text-soft)", fontSize: "0.84rem", marginTop: -4, marginBottom: 16 }}>
        국가/리그명(영문, API 표기 그대로)을 등록해서 라이브 스코어에서 숨기거나(체크) 정렬 우선순위(낮을수록 위,
        0=인기 리그와 동급)를 지정할 수 있어요. 등록하지 않은 리그는 기본 규칙(팀/리그명 사전 기반 추정)대로 표시돼요.
      </p>

      {loadError && <p className="auth-error">{loadError}</p>}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "flex-end",
          background: "var(--surface-elevated)",
          border: "1px solid var(--border-technical)",
          borderRadius: "var(--radius-md)",
          padding: 16,
          marginBottom: 20,
        }}
      >
        <label style={{ fontSize: "0.78rem", color: "var(--text-soft)", flex: "1 1 140px" }}>
          국가 (영문)
          <input value={country} onChange={(e) => setCountry(e.target.value)} required />
        </label>
        <label style={{ fontSize: "0.78rem", color: "var(--text-soft)", flex: "1 1 160px" }}>
          리그명 (영문)
          <input value={leagueName} onChange={(e) => setLeagueName(e.target.value)} required />
        </label>
        <label style={{ fontSize: "0.78rem", color: "var(--text-soft)" }}>
          우선순위 (선택)
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ width: 80 }}
            placeholder="예: 0"
          />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.84rem", paddingBottom: 10 }}>
          <input type="checkbox" checked={hidden} onChange={(e) => setHidden(e.target.checked)} />
          숨김
        </label>
        <button type="submit" className="btn-accent" disabled={submitting}>
          저장
        </button>
      </form>
      {formError && <p className="auth-error">{formError}</p>}

      <div className="board-table-wrap">
        <table className="board-table">
          <thead>
            <tr>
              <th>국가</th>
              <th className="col-title">리그명</th>
              <th>숨김</th>
              <th>우선순위</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {rows === null ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 24 }}>
                  불러오는 중...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 24, color: "var(--text-soft)" }}>
                  아직 등록된 설정이 없어요.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.country}</td>
                  <td className="col-title">{row.league_name}</td>
                  <td>{row.hidden ? "숨김" : "표시"}</td>
                  <td>{row.priority ?? "-"}</td>
                  <td>
                    <button type="button" className="btn-ghost" onClick={() => handleDelete(row.id)}>
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminPanel({ initialAuthenticated }: { initialAuthenticated: boolean }) {
  const [authenticated, setAuthenticated] = useState(initialAuthenticated);

  if (!authenticated) return <LoginForm onSuccess={() => setAuthenticated(true)} />;
  return (
    <>
      <ManagementPanel />
      <LeagueVisibilityPanel />
    </>
  );
}
