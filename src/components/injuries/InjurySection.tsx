"use client";

import { useEffect, useMemo, useState } from "react";
import { INJURIES, INJURY_LEAGUES, INJURY_STATUS_LABEL, type InjuryItem } from "@/lib/injuries";

const API_BASE = "https://www.thesportsdb.com/api/v1/json/3";
const PHOTO_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function cacheGet(key: string): string | null | undefined {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return undefined;
    const { at, data } = JSON.parse(raw) as { at: number; data: string | null };
    if (Date.now() - at > PHOTO_CACHE_TTL_MS) return undefined;
    return data;
  } catch {
    return undefined;
  }
}

function cacheSet(key: string, data: string | null) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
  } catch {
    /* storage full/unavailable - skip caching */
  }
}

interface PlayerSearchResult {
  strTeam?: string;
  strCutout?: string;
  strThumb?: string;
}

async function fetchPlayerPhoto(item: InjuryItem): Promise<string | null> {
  if (!item.photoQuery) return null;
  const cacheKey = `sp_photo_${item.photoQuery}`;
  const cached = cacheGet(cacheKey);
  if (cached !== undefined) return cached;

  try {
    const res = await fetch(`${API_BASE}/searchplayers.php?p=${encodeURIComponent(item.photoQuery)}`);
    if (!res.ok) throw new Error("bad response");
    const data = (await res.json()) as { player?: PlayerSearchResult[] | null };
    const candidates = data.player ?? [];
    let match = candidates[0] || null;
    if (item.teamEn && candidates.length > 1) {
      const teamMatch = candidates.find((p) => p.strTeam && p.strTeam.toLowerCase().includes(item.teamEn!.toLowerCase()));
      if (teamMatch) match = teamMatch;
    }
    const photo = match ? match.strCutout || match.strThumb || null : null;
    cacheSet(cacheKey, photo);
    return photo;
  } catch {
    return null;
  }
}

function InjuryCard({ item, photo }: { item: InjuryItem; photo: string | null | undefined }) {
  return (
    <div className={`injury-card status-${item.status}`}>
      {photo && (
        <div className="injury-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt="" loading="lazy" />
        </div>
      )}
      <div className="injury-card-body">
        <div className="injury-card-head">
          <span className="injury-league-badge">{item.leagueLabel}</span>
          <span className={`injury-status-badge ${item.status}`}>{INJURY_STATUS_LABEL[item.status]}</span>
          <span className="injury-updated">{item.updated} 업데이트</span>
        </div>
        <h3>{item.headline}</h3>
        <div className="team-name">
          {item.team} · {item.player}
        </div>
        <p>{item.summary}</p>
        <div className="source-note">
          구단 공식 발표 및 현지 보도를 확인해 자체 정리한 정보입니다. 사진은 TheSportsDB 선수 데이터베이스에서
          가져와요.
        </div>
      </div>
    </div>
  );
}

export default function InjurySection() {
  const [activeLeague, setActiveLeague] = useState("all");
  const [photos, setPhotos] = useState<Record<string, string | null>>({});

  const list = useMemo(
    () => (activeLeague === "all" ? INJURIES : INJURIES.filter((i) => i.league === activeLeague)),
    [activeLeague]
  );

  useEffect(() => {
    let cancelled = false;
    list.forEach((item) => {
      if (!item.photoQuery || item.id in photos) return;
      fetchPlayerPhoto(item).then((url) => {
        if (!cancelled) setPhotos((prev) => ({ ...prev, [item.id]: url }));
      });
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  const latestUpdated = useMemo(() => INJURIES.reduce((max, i) => (i.updated > max ? i.updated : max), ""), []);

  return (
    <section className="section wrap">
      <div className="league-tabs injury-tabs">
        {INJURY_LEAGUES.map((l) => (
          <button
            key={l.id}
            type="button"
            className={`league-tab ${activeLeague === l.id ? "active" : ""}`}
            onClick={() => setActiveLeague(l.id)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="section-head" style={{ marginTop: 18 }}>
        <h2>
          <span className="material-symbols-outlined">emergency</span> 최신 부상자 소식
        </h2>
        <span className="live-indicator">
          <span className="pulse-dot"></span>최근 업데이트: {latestUpdated}
        </span>
      </div>
      <div className="injury-grid">
        {list.length === 0 ? (
          <p style={{ color: "var(--text-soft)", textAlign: "center", padding: "40px 0" }}>
            해당 리그의 최신 소식이 아직 없어요.
          </p>
        ) : (
          list.map((item) => <InjuryCard key={item.id} item={item} photo={photos[item.id]} />)
        )}
      </div>
    </section>
  );
}
