import type { Metadata } from "next";
import CommunityView from "@/components/community/CommunityView";

export const metadata: Metadata = {
  title: "게시글 | 데일리스코어 커뮤니티",
  robots: { index: false },
};

export default async function CommunityPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <main>
      <CommunityView postId={Number(id)} />
    </main>
  );
}
