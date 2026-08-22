/* Supabase 클라이언트 싱글턴. supabase-config.js와 Supabase CDN 스크립트 다음에 불러오세요. */
const sbClient =
  typeof SUPABASE_URL !== "undefined" && typeof window.supabase !== "undefined"
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
