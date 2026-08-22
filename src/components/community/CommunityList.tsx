"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

interface PostRow {
  id: number;
  title: string;
  author_email: string;
  created_at: string;
  views: number;
}

const PAGE_SIZE = 15;

function nickOf(email: string) {
  return (email || "").split("@")[0];
}

export default function CommunityList() {
  const client = getSupabaseClient();
  const { session, openModal } = useAuth();

  const [posts, setPosts] = useState<PostRow[] | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loadError, setLoadError] = useState(false);

  const [writeOpen, setWriteOpen] = useState(false);
  const [writeTitle, setWriteTitle] = useState("");
  const [writeContent, setWriteContent] = useState("");
  const [writeError, setWriteError] = useState<string | null>(null);
  const [writeSubmitting, setWriteSubmitting] = useState(false);

  useEffect(() => {
    if (!client) return;
    let cancelled = false;
    // Reset to the loading state for the new page/search before the fetch resolves.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosts(null);

    const from = (currentPage - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    let query = client.from("community_posts").select("id, title, author_email, created_at, views", { count: "exact" });
    if (searchTerm) query = query.ilike("title", `%${searchTerm}%`);

    query
      .order("id", { ascending: false })
      .range(from, to)
      .then(({ data, count, error }) => {
        if (cancelled) return;
        if (error) {
          setLoadError(true);
          setPosts([]);
          return;
        }
        setLoadError(false);
        setTotalCount(count || 0);
        setPosts(data ?? []);
      });

    return () => {
      cancelled = true;
    };
  }, [client, currentPage, searchTerm]);

  function handleSearchSubmit(e: FormEvent) {
    e.preventDefault();
    setSearchTerm(searchInput.trim());
    setCurrentPage(1);
  }

  function handleWriteClick() {
    if (!session) {
      alert("로그인 후 글을 작성할 수 있어요.");
      openModal("login");
      return;
    }
    setWriteTitle("");
    setWriteContent("");
    setWriteError(null);
    setWriteOpen(true);
  }

  async function handleWriteSubmit(e: FormEvent) {
    e.preventDefault();
    setWriteError(null);

    if (!client || !session) {
      setWriteError("로그인이 필요해요.");
      return;
    }
    const title = writeTitle.trim();
    const content = writeContent.trim();
    if (!title || !content) return;

    setWriteSubmitting(true);
    const { error } = await client.from("community_posts").insert({
      author_id: session.user.id,
      author_email: session.user.email,
      title,
      content,
    });
    setWriteSubmitting(false);

    if (error) {
      setWriteError("등록에 실패했어요: " + error.message);
      return;
    }

    setWriteOpen(false);
    setSearchInput("");
    setSearchTerm("");
    setCurrentPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const from = (currentPage - 1) * PAGE_SIZE;

  return (
    <>
      <section className="hero wrap" style={{ padding: "40px 0 20px" }}>
        <h1>커뮤니티</h1>
        <p>부상 소식, 경기 예상, 응원 이야기까지 — 데일리스코어 이용자들과 자유롭게 나눠보세요.</p>
      </section>

      <section className="section wrap board-wrap">
        <div className="board-toolbar">
          <form className="board-search" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="제목 검색"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="btn-ghost">
              검색
            </button>
          </form>
          <button type="button" className="btn-accent" onClick={handleWriteClick}>
            글쓰기
          </button>
        </div>

        <div className="board-table-wrap">
          <table className="board-table">
            <thead>
              <tr>
                <th className="col-no">번호</th>
                <th className="col-title">제목</th>
                <th className="col-author">글쓴이</th>
                <th className="col-date">날짜</th>
                <th className="col-views">조회</th>
              </tr>
            </thead>
            <tbody>
              {!client || loadError ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "var(--text-soft)", padding: 24 }}>
                    게시판을 불러오지 못했어요.
                  </td>
                </tr>
              ) : posts === null ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "var(--text-soft)", padding: 24 }}>
                    불러오는 중...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "var(--text-soft)", padding: 24 }}>
                    {searchTerm ? "검색 결과가 없어요." : "아직 등록된 글이 없어요. 첫 글을 남겨보세요!"}
                  </td>
                </tr>
              ) : (
                posts.map((p, idx) => (
                  <tr key={p.id}>
                    <td className="col-no">{totalCount - from - idx}</td>
                    <td className="col-title">
                      <Link href={`/community/${p.id}`}>{p.title}</Link>
                    </td>
                    <td className="col-author">{nickOf(p.author_email)}</td>
                    <td className="col-date">{p.created_at.slice(0, 10)}</td>
                    <td className="col-views">{p.views}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="board-pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              className={`board-page ${page === currentPage ? "active" : ""}`}
              onClick={() => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {page}
            </button>
          ))}
        </div>
      </section>

      {writeOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setWriteOpen(false);
          }}
        >
          <div className="modal" style={{ maxWidth: 560 }}>
            <button type="button" className="modal-close" aria-label="닫기" onClick={() => setWriteOpen(false)}>
              &times;
            </button>
            <h3>글쓰기</h3>
            <p className="modal-sub">데일리스코어 커뮤니티에 새 글을 남겨보세요.</p>
            <form onSubmit={handleWriteSubmit}>
              <label>
                제목
                <input
                  type="text"
                  required
                  maxLength={120}
                  value={writeTitle}
                  onChange={(e) => setWriteTitle(e.target.value)}
                />
              </label>
              <label>
                내용
                <textarea
                  required
                  maxLength={5000}
                  rows={8}
                  value={writeContent}
                  onChange={(e) => setWriteContent(e.target.value)}
                />
              </label>
              {writeError && <p className="auth-error">{writeError}</p>}
              <button type="submit" className="btn-accent full" disabled={writeSubmitting}>
                등록
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
