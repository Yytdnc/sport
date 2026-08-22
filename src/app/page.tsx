import Hero from "@/components/home/Hero";
import ScoreboardSection from "@/components/scores/ScoreboardSection";
import FloatingChatBubble from "@/components/chat/FloatingChatBubble";
import { getAllSportsForDate } from "@/lib/scores/aggregate";
import { todayISO } from "@/lib/scores/utils";

// "Today" must be evaluated per-request, not baked into a statically cached
// page — otherwise a stale ISR render serves yesterday's date in the SSR
// HTML while a fresher RSC payload/client clock disagrees, causing a
// hydration mismatch. The actual data fetches below stay cheap via their
// own unstable_cache windows, so this doesn't reintroduce the quota risk.
export const dynamic = "force-dynamic";

export default async function Home() {
  const date = todayISO();
  const initialData = await getAllSportsForDate(date);

  return (
    <main>
      <Hero />
      <ScoreboardSection initialDate={date} initialData={initialData} />
      <p className="disclaimer">
        본 사이트는 재미와 정보 제공을 목적으로 하는 콘텐츠이며, 실제 베팅·도박을 권유하거나 중개하지
        않습니다. 모든 정보는 공식 발표 및 언론 보도를 바탕으로 자체 정리한 것으로 실시간 정확성을
        보장하지 않으니 최종 확인은 공식 채널을 통해 해주세요.
      </p>
      <FloatingChatBubble />
    </main>
  );
}
