"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { getSupabaseClient } from "@/lib/supabase/client";

export default function Header() {
  const pathname = usePathname();
  const { session, loading, openModal } = useAuth();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <Link className="brand" href="/">
          <span className="logo-emoji">⚽</span>데일리<span className="accent">스코어</span>
        </Link>
        <nav>
          <Link className={pathname === "/" ? "active" : ""} href="/">
            홈
          </Link>
          <Link className={pathname === "/injuries" ? "active" : ""} href="/injuries">
            부상자 정보
          </Link>
        </nav>
      </div>
      <div className={`auth-area ${session ? "logged-in" : ""}`}>
        {loading ? null : session ? (
          <>
            <span className="user-chip">
              <span className="material-symbols-outlined">account_circle</span>
              <span>{session.user.email}</span>
            </span>
            <button type="button" className="btn-ghost" onClick={() => getSupabaseClient()?.auth.signOut()}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn-ghost" onClick={() => openModal("login")}>
              로그인
            </button>
            <button type="button" className="btn-accent" onClick={() => openModal("signup")}>
              회원가입
            </button>
          </>
        )}
      </div>
    </header>
  );
}
