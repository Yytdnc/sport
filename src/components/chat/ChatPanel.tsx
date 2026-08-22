"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";

interface ChatMessage {
  id: number;
  author_email: string;
  content: string;
  created_at: string;
}

const HISTORY_LIMIT = 50;

function nickOf(email: string | null | undefined) {
  return (email || "익명").split("@")[0];
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPanel() {
  const { session, openModal } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[] | null>(null);
  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const client = getSupabaseClient();

  useEffect(() => {
    if (!client) return;

    let cancelled = false;
    client
      .from("chat_messages")
      .select("id, author_email, content, created_at")
      .order("id", { ascending: false })
      .limit(HISTORY_LIMIT)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          setMessages([]);
          return;
        }
        setMessages(data.slice().reverse());
      });

    const messagesChannel = client
      .channel("chat_messages_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          setMessages((prev) => [...(prev ?? []), payload.new as ChatMessage]);
        }
      )
      .subscribe();

    const presenceKey = crypto.randomUUID ? crypto.randomUUID() : String(Math.random());
    const presenceChannel = client.channel("chat_online", { config: { presence: { key: presenceKey } } });
    presenceChannel
      .on("presence", { event: "sync" }, () => {
        setOnlineCount(Object.keys(presenceChannel.presenceState()).length);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") presenceChannel.track({ at: Date.now() });
      });

    return () => {
      cancelled = true;
      client.removeChannel(messagesChannel);
      client.removeChannel(presenceChannel);
    };
  }, [client]);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    if (isNearBottom) el.scrollTop = el.scrollHeight;
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const content = input.trim();
    if (!content || !client) return;

    if (!session) {
      alert("로그인 후 채팅에 참여할 수 있어요.");
      openModal("login");
      return;
    }

    setSending(true);
    const { error } = await client.from("chat_messages").insert({
      author_id: session.user.id,
      author_email: session.user.email,
      content,
    });
    setSending(false);
    if (!error) setInput("");
  }

  return (
    <div className="live-chat">
      <div className="chat-head">
        <span>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
            forum
          </span>{" "}
          실시간 채팅
        </span>
        <span className="chat-online">{onlineCount != null ? `${onlineCount.toLocaleString("ko-KR")}명 접속 중` : "- 명 접속 중"}</span>
      </div>
      <div className="chat-messages" ref={messagesRef}>
        {!client ? (
          <p className="chat-empty">채팅 연결에 문제가 있어요.</p>
        ) : messages === null ? (
          <p className="chat-empty">불러오는 중...</p>
        ) : messages.length === 0 ? (
          <p className="chat-empty">아직 채팅이 없어요. 첫 메시지를 남겨보세요!</p>
        ) : (
          messages.map((m) => (
            <div className="chat-msg" key={m.id}>
              <span className="nick">{nickOf(m.author_email)}</span>
              <span className="body">{m.content}</span>
              <span className="time">{fmtTime(m.created_at)}</span>
            </div>
          ))
        )}
      </div>
      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          maxLength={300}
          autoComplete="off"
          value={input}
          disabled={sending}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn-accent" disabled={sending}>
          전송
        </button>
      </form>
    </div>
  );
}
