"use client";

import { FormEvent, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";

const COPY = {
  login: { title: "로그인", sub: "데일리스코어 계정으로 로그인하세요.", submit: "로그인" },
  signup: { title: "회원가입", sub: "이메일과 비밀번호(6자 이상)로 가입해요.", submit: "회원가입" },
} as const;

const AUTH_ERROR_KO: Record<string, string> = {
  "Invalid login credentials": "이메일 또는 비밀번호가 올바르지 않아요.",
  "User already registered": "이미 가입된 이메일이에요.",
  "Password should be at least 6 characters": "비밀번호는 6자 이상이어야 해요.",
};

interface Props {
  mode: "login" | "signup";
  onClose: () => void;
  onModeChange: (mode: "login" | "signup") => void;
}

export default function AuthModal({ mode, onClose, onModeChange }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);

    const client = getSupabaseClient();
    if (!client) {
      setError("서비스 연결에 문제가 있어요.");
      setSubmitting(false);
      return;
    }

    try {
      if (mode === "signup") {
        const { data, error } = await client.auth.signUp({ email: email.trim(), password });
        if (error) throw error;
        if (data.session) {
          onClose();
        } else {
          setInfo("가입 확인 이메일을 보냈어요. 메일함을 확인해주세요.");
        }
      } else {
        const { error } = await client.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        onClose();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "문제가 발생했어요. 다시 시도해주세요.";
      setError(AUTH_ERROR_KO[message] || message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal">
        <button type="button" className="modal-close" aria-label="닫기" onClick={onClose}>
          &times;
        </button>
        <div className="modal-tabs">
          <button
            type="button"
            className={`modal-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => onModeChange("login")}
          >
            로그인
          </button>
          <button
            type="button"
            className={`modal-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => onModeChange("signup")}
          >
            회원가입
          </button>
        </div>
        <h3>{COPY[mode].title}</h3>
        <p className="modal-sub">{COPY[mode].sub}</p>
        <form onSubmit={handleSubmit}>
          <label>
            이메일
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            비밀번호
            <input
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          {error && <p className="auth-error">{error}</p>}
          {info && <p className="auth-info">{info}</p>}
          <button type="submit" className="btn-accent full" disabled={submitting}>
            {COPY[mode].submit}
          </button>
        </form>
      </div>
    </div>
  );
}
