-- v1 数据结构草案（Supabase）

-- 用户资料表（预留 phone 字段）
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  level integer default 1,
  current_xp integer default 0,
  next_level_xp integer default 100,
  last_source text,
  phone text,
  phone_verified_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 日记表（支持同日多条记录）
create table if not exists public.diaries (
  id uuid primary key,
  user_id uuid references auth.users(id) on delete cascade,
  date date not null,
  time text not null,
  diary_text text not null,
  location text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 成就结果表（AI 生成）
create table if not exists public.achievements (
  id uuid primary key,
  user_id uuid references auth.users(id) on delete cascade,
  entry_id uuid references public.diaries(id) on delete cascade,
  date date not null,
  titles text[] not null,
  description text not null,
  xp integer not null,
  tags text[] not null,
  location_city text,
  achievement_version text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 成就库（v1 预置成就）
create table if not exists public.achievement_catalog (
  id text primary key,
  name text not null,
  description text,
  badge_url text,
  condition jsonb,
  created_at timestamptz default now()
);

-- 成就解锁记录
create table if not exists public.achievement_unlocks (
  id uuid primary key,
  user_id uuid references auth.users(id) on delete cascade,
  achievement_id text references public.achievement_catalog(id) on delete cascade,
  unlocked_at timestamptz default now(),
  unique (user_id, achievement_id)
);

-- RLS
alter table public.profiles enable row level security;
alter table public.diaries enable row level security;
alter table public.achievements enable row level security;
alter table public.achievement_unlocks enable row level security;

create policy "profiles_owner" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_owner_update" on public.profiles
  for update using (auth.uid() = id);

create policy "diaries_owner" on public.diaries
  for all using (auth.uid() = user_id);

create policy "achievements_owner" on public.achievements
  for all using (auth.uid() = user_id);

create policy "achievement_unlocks_owner" on public.achievement_unlocks
  for all using (auth.uid() = user_id);
