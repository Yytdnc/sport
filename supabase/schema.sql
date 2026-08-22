-- SportPick 커뮤니티 게시판 스키마
-- Supabase 대시보드 → SQL Editor 에서 이 스크립트를 1회 실행하세요.
-- (이미 로그인/회원가입은 Supabase Auth를 그대로 사용하므로 별도 유저 테이블은 필요 없어요.)

create table if not exists community_posts (
  id bigint generated always as identity primary key,
  author_id uuid not null references auth.users(id) on delete cascade,
  author_email text not null,
  title text not null check (char_length(title) between 1 and 120),
  content text not null check (char_length(content) between 1 and 5000),
  views integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists community_comments (
  id bigint generated always as identity primary key,
  post_id bigint not null references community_posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  author_email text not null,
  content text not null check (char_length(content) between 1 and 1000),
  created_at timestamptz not null default now()
);

alter table community_posts enable row level security;
alter table community_comments enable row level security;

-- 게시글: 누구나 조회, 로그인한 본인만 작성/수정/삭제
create policy "community_posts_select" on community_posts
  for select using (true);
create policy "community_posts_insert" on community_posts
  for insert with check (auth.uid() = author_id);
create policy "community_posts_update_own" on community_posts
  for update using (auth.uid() = author_id);
create policy "community_posts_delete_own" on community_posts
  for delete using (auth.uid() = author_id);

-- 댓글: 누구나 조회, 로그인한 본인만 작성/삭제
create policy "community_comments_select" on community_comments
  for select using (true);
create policy "community_comments_insert" on community_comments
  for insert with check (auth.uid() = author_id);
create policy "community_comments_delete_own" on community_comments
  for delete using (auth.uid() = author_id);

-- 조회수 증가는 RLS를 우회하는 전용 함수로 처리 (누구나 호출 가능, views 컬럼만 +1)
create or replace function increment_post_views(p_id bigint)
returns void
language sql
security definer
set search_path = public
as $$
  update community_posts set views = views + 1 where id = p_id;
$$;

grant execute on function increment_post_views(bigint) to anon, authenticated;

-- 실시간 채팅 (라이브스코어 페이지 사이드바)
create table if not exists chat_messages (
  id bigint generated always as identity primary key,
  author_id uuid not null references auth.users(id) on delete cascade,
  author_email text not null,
  content text not null check (char_length(content) between 1 and 300),
  created_at timestamptz not null default now()
);

alter table chat_messages enable row level security;

create policy "chat_messages_select" on chat_messages
  for select using (true);
create policy "chat_messages_insert" on chat_messages
  for insert with check (auth.uid() = author_id);

-- 실시간 브로드캐스트를 위해 Realtime publication에 추가
alter publication supabase_realtime add table chat_messages;

-- 어드민 페이지에서 관리하는 팀명/리그명 한글 번역 오버라이드
-- (코드에 내장된 사전보다 우선 적용됨). 쓰기는 어드민 API 라우트가
-- service_role 키로만 수행하므로, RLS는 조회만 열어두면 충분합니다.
create table if not exists name_overrides (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('team', 'league', 'country')),
  original_name text not null,
  country text,
  korean_name text not null check (char_length(korean_name) between 1 and 120),
  created_at timestamptz not null default now(),
  unique (kind, original_name, country)
);

alter table name_overrides enable row level security;

create policy "name_overrides_select" on name_overrides
  for select using (true);
-- insert/update/delete: 의도적으로 정책 없음 — anon/authenticated 모두 쓰기 불가.
-- 어드민 API 라우트가 service_role 키(RLS 우회)로만 씁니다.

-- 어드민 페이지에서 리그를 숨기거나(체크) 우선순위를 조정하는 설정.
-- hidden=true인 리그는 라이브 스코어에서 아예 제외됩니다.
create table if not exists league_visibility (
  id bigint generated always as identity primary key,
  country text not null,
  league_name text not null,
  hidden boolean not null default false,
  priority integer,
  created_at timestamptz not null default now(),
  unique (country, league_name)
);

alter table league_visibility enable row level security;

create policy "league_visibility_select" on league_visibility
  for select using (true);
-- insert/update/delete: 의도적으로 정책 없음 — 어드민 API 라우트가 service_role 키로만 씁니다.
