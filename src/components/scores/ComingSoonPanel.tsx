import styles from "./scores.module.css";

export default function ComingSoonPanel({ sportLabel }: { sportLabel: string }) {
  return (
    <div className={styles.comingSoon}>
      <span className="icon" style={{ fontSize: "2.4rem", display: "block", marginBottom: 10 }}>
        🚧
      </span>
      <p>
        {sportLabel} 종목은 아직 연동된 데이터 소스가 없어 준비 중이에요.
        <br />
        임의로 만든 경기 정보를 보여드리지는 않을게요.
      </p>
    </div>
  );
}
