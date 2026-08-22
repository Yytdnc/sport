import type { Metadata } from "next";

export const metadata: Metadata = { title: "개인정보처리방침 | 데일리스코어" };

export default function PrivacyPage() {
  return (
    <main className="wrap" style={{ maxWidth: 720, padding: "48px 20px 60px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}>개인정보처리방침</h1>
      <p style={{ color: "var(--text-soft)" }}>
        데일리스코어는 회원가입 없이도 대부분의 정보를 볼 수 있는 사이트예요. 다만 회원가입을 하시면 이메일과
        비밀번호를 인증 서비스(Supabase)를 통해 수집·저장하며, 이는 로그인 기능 제공 목적으로만 사용돼요.
      </p>
      <p style={{ color: "var(--text-soft)" }}>
        비밀번호는 암호화되어 저장되고 데일리스코어 운영자는 원문을 볼 수 없어요. 수집된 정보를 제3자에게
        제공하거나 판매하지 않으며, 회원 탈퇴 및 계정 삭제를 원하시면 문의해주세요.
      </p>
      <p style={{ color: "var(--text-soft)" }}>
        로그인 후 커뮤니티 게시판에 작성하신 글·댓글은 작성자 이메일의 아이디 부분(@ 앞부분)과 함께 다른
        이용자에게 공개돼요. 작성한 글·댓글은 본인이 직접 삭제할 수 있어요.
      </p>
      <p style={{ color: "var(--text-soft)" }}>본 페이지는 추후 광고/분석 도구 연동 시 갱신될 수 있습니다.</p>
    </main>
  );
}
