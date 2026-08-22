"use client";

import type { Session } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import AuthModal from "@/components/auth/AuthModal";

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  openModal: (mode?: "login" | "signup") => void;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  loading: true,
  openModal: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(() => Boolean(getSupabaseClient()));
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) return;
    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = client.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => sub.subscription.unsubscribe();
  }, []);

  const openModal = useCallback((mode: "login" | "signup" = "login") => {
    setModalMode(mode);
    setModalOpen(true);
  }, []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <AuthContext.Provider value={{ session, loading, openModal }}>
      {children}
      {modalOpen && <AuthModal mode={modalMode} onClose={closeModal} onModeChange={setModalMode} />}
    </AuthContext.Provider>
  );
}
