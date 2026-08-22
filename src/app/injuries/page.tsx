import type { Metadata } from "next";
import InjurySection from "@/components/injuries/InjurySection";

export const metadata: Metadata = {
  title: "부상자 정보 | 데일리스코어",
  description: "MLB, EPL, 라리가, 리그앙, 분데스리가 팀별 부상자 현황을 정리해드려요.",
};

export default function InjuriesPage() {
  return (
    <main>
      <InjurySection />
    </main>
  );
}
