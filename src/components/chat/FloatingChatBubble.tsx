"use client";

import { useState } from "react";
import ChatPanel from "@/components/chat/ChatPanel";

export default function FloatingChatBubble() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="chat-bubble" onClick={() => setOpen(true)} aria-label="실시간 채팅 열기">
        <span className="material-symbols-outlined">forum</span>
      </button>
      {open && (
        <div
          className="chat-drawer-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <button type="button" className="chat-drawer-close" aria-label="닫기" onClick={() => setOpen(false)}>
            &times;
          </button>
          <div className="chat-drawer">
            <ChatPanel />
          </div>
        </div>
      )}
    </>
  );
}
