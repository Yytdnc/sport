"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

interface Post {
  id: number;
  author_id: string;
  author_email: string;
  title: string;
  content: string;
  views: number;
  created_at: string;
}

interface Comment {
  id: number;
  author_email: string;
  content: string;
  created_at: string;
}

function nickOf(email: string) {
  return (email || "").split("@")[0];
}
function fmtDate(iso: string) {
  return iso.slice(0, 16).replace("T", " ");
}

export default function CommunityView({ postId }: { postId: number }) {
  const client = getSupabaseClient();
  const { session } = useAuth();
  const router = useRouter();

  const [post, setPost] = useState<Post | null>(null);
  const [notFound, setNotFound] = useState(() => !client || !postId);
  const [comments, setComments] = useState<Comment[] | null>(null);
  const [commentContent, setCommentContent] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);

  async function loadComments() {
    if (!client) return;
    const { data, error } = await client
      .from("community_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (!error) setComments(data ?? []);
  }

  useEffect(() => {
    if (!client || !postId) return;
    let cancelled = false;

    client
      .from("community_posts")
      .select("*")
      .eq("id", postId)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setNotFound(true);
          return;
        }
        setPost(data);
        client.rpc("increment_post_views", { p_id: postId });
        loadComments();
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, postId]);

  async function handleDelete() {
    if (!client || !confirm("이 글을 삭제할까요?")) return;
    await client.from("community_posts").delete().eq("id", postId);
    router.push("/community");
  }

  async function handleCommentSubmit(e: FormEvent) {
    e.preventDefault();
    setCommentError(null);

    if (!client || !session) {
      setCommentError("로그인 후 댓글을 작성할 수 있어요.");
      return;
    }
    const content = commentContent.trim();
    if (!content) return;

    const { error } = await client.from("community_comments").insert({
      post_id: postId,
      author_id: session.user.id,
      author_email: session.user.email,
      content,
    });

    if (error) {
      setCommentError("댓글 등록에 실패했어요: " + error.message);
      return;
    }
    setCommentContent("");
    loadComments();
  }

  return (
    <section className="section wrap board-wrap" style={{ paddingTop: 36 }}>
      <div className="board-view">
        {notFound ? (
          <p style={{ color: "var(--text-soft)" }}>
            {!client ? "게시판 연결에 문제가 있어요." : !postId ? "잘못된 게시글이에요." : "게시글을 찾을 수 없어요."}
          </p>
        ) : !post ? (
          <p style={{ color: "var(--text-soft)", textAlign: "center", padding: "24px 0" }}>불러오는 중...</p>
        ) : (
          <>
            <div className="board-view-head">
              <h2>{post.title}</h2>
              <div className="board-view-meta">
                <span>{nickOf(post.author_email)}</span>
                <span>{fmtDate(post.created_at)}</span>
                <span>조회 {post.views + 1}</span>
              </div>
            </div>
            <div className="board-view-body">{post.content}</div>
            {session && session.user.id === post.author_id && (
              <div className="board-view-actions">
                <button type="button" className="btn-ghost" onClick={handleDelete}>
                  삭제
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {post && (
        <div className="board-comments">
          <h3>댓글 ({comments?.length ?? 0})</h3>
          <div>
            {!comments || comments.length === 0 ? (
              <p style={{ color: "var(--text-soft)", fontSize: "0.85rem" }}>첫 댓글을 남겨보세요.</p>
            ) : (
              comments.map((c) => (
                <div className="comment-row" key={c.id}>
                  <div className="comment-meta">
                    <span>{nickOf(c.author_email)}</span>
                    <span>{fmtDate(c.created_at)}</span>
                  </div>
                  <div className="comment-body">{c.content}</div>
                </div>
              ))
            )}
          </div>
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              required
              maxLength={1000}
              rows={3}
              placeholder="댓글을 입력하세요"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            {commentError && <p className="auth-error">{commentError}</p>}
            <button type="submit" className="btn-accent">
              댓글 등록
            </button>
          </form>
        </div>
      )}

      <div className="board-actions">
        <Link href="/community" className="btn-ghost">
          목록으로
        </Link>
      </div>
    </section>
  );
}
