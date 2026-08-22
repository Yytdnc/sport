import type { Metadata } from "next";
import CommunityList from "@/components/community/CommunityList";

export const metadata: Metadata = {
  title: "커뮤니티 | 데일리스코어",
  description: "데일리스코어 이용자들이 자유롭게 소통하는 커뮤니티 게시판이에요.",
};

export default function CommunityPage() {
  return (
    <main>
      <CommunityList />
    </main>
  );
}
