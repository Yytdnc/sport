import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="foot-links">
        <Link href="/">홈</Link>
        <Link href="/community">커뮤니티</Link>
        <Link href="/privacy">개인정보처리방침</Link>
      </div>
      <p>© 2026 데일리스코어. 본 사이트의 정보는 참고용이며 베팅을 권장하지 않습니다.</p>
    </footer>
  );
}
