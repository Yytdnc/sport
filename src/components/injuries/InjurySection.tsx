"use client";

import { useEffect, useMemo, useState } from "react";
import { INJURIES, INJURY_LEAGUES, INJURY_STATUS_LABEL, type InjuryItem, type InjuryStatus } from "@/lib/injuries";

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

// Light, non-NLP heuristic: take the part of the headline after the first comma
// (headlines are written as "누구, 무슨 부상…" or "팀, 무슨 일…") and cut at the
// first "…" so the key-absence line stays a short phrase instead of a full sentence.
function shortReason(headline: string): string {
  const commaIdx = headline.indexOf(",");
  let rest = commaIdx >= 0 ? headline.slice(commaIdx + 1) : headline;
  const ellipsisIdx = rest.indexOf("…");
  if (ellipsisIdx >= 0) rest = rest.slice(0, ellipsisIdx);
  return rest.trim();
}

interface TeamGroup {
  team: string;
  leagueLabel: string;
  items: InjuryItem[];
  outCount: number;
  cautionCount: number;
  okCount: number;
  keyItem: InjuryItem;
}

const SEVERITY_RANK: Record<InjuryStatus, number> = { out: 0, doubtful: 1, questionable: 2, ok: 3 };

function groupByTeam(items: InjuryItem[]): TeamGroup[] {
  const map = new Map<string, InjuryItem[]>();
  items.forEach((item) => {
    const list = map.get(item.team) ?? [];
    list.push(item);
    map.set(item.team, list);
  });

  return Array.from(map.entries())
    .map(([team, teamItems]) => {
      const byUpdatedDesc = teamItems.slice().sort((a, b) => b.updated.localeCompare(a.updated));
      const keyItem = teamItems
        .slice()
        .sort((a, b) => SEVERITY_RANK[a.status] - SEVERITY_RANK[b.status] || b.updated.localeCompare(a.updated))[0];
      return {
        team,
        leagueLabel: teamItems[0].leagueLabel,
        items: byUpdatedDesc,
        outCount: teamItems.filter((i) => i.status === "out").length,
        cautionCount: teamItems.filter((i) => i.status === "doubtful" || i.status === "questionable").length,
        okCount: teamItems.filter((i) => i.status === "ok").length,
        keyItem,
      };
    })
    .sort((a, b) => b.items.length - a.items.length);
}

function InjuryDetailCard({ item, photo }: { item: InjuryItem; photo: string | null | undefined }) {
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
          <span className={`injury-status-badge ${item.status}`}>{INJURY_STATUS_LABEL[item.status]}</span>
          <span className="injury-updated">{item.updated} 업데이트</span>
        </div>
        <h3>{item.headline}</h3>
        <div className="team-name">{item.player}</div>
        <p>{item.summary}</p>
      </div>
    </div>
  );
}

function TeamInjuryCard({
  group,
  expanded,
  onToggle,
  photos,
}: {
  group: TeamGroup;
  expanded: boolean;
  onToggle: () => void;
  photos: Record<string, string | null>;
}) {
  const total = group.items.length;
  return (
    <div className="team-injury-card">
      <div className="team-injury-head">
        <div>
          <span className="team-injury-name">{group.team}</span>
          <span className="injury-league-badge">{group.leagueLabel}</span>
        </div>
        <span className="team-injury-count">{total}명</span>
      </div>
      <div className="team-injury-dots">
        {group.outCount > 0 && (
          <span className="dot-badge out">
            <span className="dot" /> {group.outCount}
          </span>
        )}
        {group.cautionCount > 0 && (
          <span className="dot-badge caution">
            <span className="dot" /> {group.cautionCount}
          </span>
        )}
        {group.okCount > 0 && (
          <span className="dot-badge ok">
            <span className="dot" /> {group.okCount}
          </span>
        )}
      </div>
      <div className="team-injury-key">
        핵심 결장: <strong>{group.keyItem.player}</strong>
        {shortReason(group.keyItem.headline) && ` (${shortReason(group.keyItem.headline)})`}
      </div>
      <button type="button" className="btn-ghost team-injury-toggle" onClick={onToggle}>
        {expanded ? "접기" : "부상자 보기"}
      </button>
      {expanded && (
        <div className="team-injury-detail-list">
          {group.items.map((item) => (
            <InjuryDetailCard key={item.id} item={item} photo={photos[item.id]} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function InjurySection() {
  const [activeLeague, setActiveLeague] = useState("all");
  const [photos, setPhotos] = useState<Record<string, string | null>>({});
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());

  const list = useMemo(
    () => (activeLeague === "all" ? INJURIES : INJURIES.filter((i) => i.league === activeLeague)),
    [activeLeague]
  );

  const teamGroups = useMemo(() => groupByTeam(list), [list]);

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

  function toggleTeam(team: string) {
    setExpandedTeams((prev) => {
      const next = new Set(prev);
      if (next.has(team)) next.delete(team);
      else next.add(team);
      return next;
    });
  }

  return (
    <section id="injuries" className="section wrap" style={{ scrollMarginTop: 84 }}>
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
          <span className="material-symbols-outlined">emergency</span> 팀별 부상자 현황
        </h2>
        <span className="live-indicator">
          <span className="pulse-dot"></span>최근 업데이트: {latestUpdated}
        </span>
      </div>

      {teamGroups.length === 0 ? (
        <p style={{ color: "var(--text-soft)", textAlign: "center", padding: "40px 0" }}>
          해당 리그의 최신 소식이 아직 없어요.
        </p>
      ) : (
        <div className="injury-overview">
          <div className="injury-overview-tile">
            <span className="label">총 결장자</span>
            <span className="value">{list.length}명</span>
          </div>
          <div className="injury-overview-tile">
            <span className="label">영향 큰 팀</span>
            <span className="value">{teamGroups[0].team}</span>
          </div>
          <div className="injury-overview-tile">
            <span className="label">집계 팀 수</span>
            <span className="value">{teamGroups.length}팀</span>
          </div>
        </div>
      )}

      <div className="team-injury-grid">
        {teamGroups.map((group) => (
          <TeamInjuryCard
            key={group.team}
            group={group}
            expanded={expandedTeams.has(group.team)}
            onToggle={() => toggleTeam(group.team)}
            photos={photos}
          />
        ))}
      </div>
      <p className="source-note" style={{ marginTop: 14 }}>
        구단 공식 발표 및 현지 보도를 확인해 자체 정리한 정보입니다. 선수 사진은 TheSportsDB 데이터베이스에서
        가져와요.
      </p>
    </section>
  );
}
