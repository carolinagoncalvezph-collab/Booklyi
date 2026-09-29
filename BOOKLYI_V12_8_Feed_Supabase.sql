-- Booklyi V12.8 — Feed social real no Supabase
-- Execute UMA VEZ no Supabase SQL Editor.
-- Este script é idempotente: pode ser executado novamente sem recriar os dados.

-- ============================================================
-- 1) PUBLICAÇÕES
-- ============================================================
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  book_id uuid references public.books(id) on delete set null,
  content text not null default '',
  spoiler boolean not null default false,
  rating integer not null default 0 check (rating between 0 and 5),
  created_at timestamptz not null default now()
);

alter table public.posts add column if not exists user_id uuid;
alter table public.posts add column if not exists book_id uuid;
alter table public.posts add column if not exists content text;
alter table public.posts add column if not exists spoiler boolean default false;
alter table public.posts add column if not exists rating integer default 0;
alter table public.posts add column if not exists created_at timestamptz default now();

-- ============================================================
-- 2) COMENTÁRIOS
-- ============================================================
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null default '',
  created_at timestamptz not null default now()
);

alter table public.comments add column if not exists post_id uuid;
alter table public.comments add column if not exists user_id uuid;
alter table public.comments add column if not exists content text;
alter table public.comments add column if not exists created_at timestamptz default now();

-- ============================================================
-- 3) RESPOSTAS A COMENTÁRIOS
-- ============================================================
create table if not exists public.comment_replies (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null default '',
  created_at timestamptz not null default now()
);

alter table public.comment_replies add column if not exists comment_id uuid;
alter table public.comment_replies add column if not exists user_id uuid;
alter table public.comment_replies add column if not exists content text;
alter table public.comment_replies add column if not exists created_at timestamptz default now();

-- ============================================================
-- 4) CURTIDAS DE PUBLICAÇÕES
-- ============================================================
create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- ============================================================
-- 5) CURTIDAS DE COMENTÁRIOS
-- ============================================================
create table if not exists public.comment_likes (
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

-- ============================================================
-- 6) CURTIDAS DE RESPOSTAS
-- ============================================================
create table if not exists public.reply_likes (
  reply_id uuid not null references public.comment_replies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (reply_id, user_id)
);

-- ============================================================
-- 7) ÍNDICES
-- ============================================================
create index if not exists posts_created_at_idx on public.posts(created_at desc);
create index if not exists posts_user_id_idx on public.posts(user_id);
create index if not exists posts_book_id_idx on public.posts(book_id);
create index if not exists comments_post_id_idx on public.comments(post_id);
create index if not exists comment_replies_comment_id_idx on public.comment_replies(comment_id);
create index if not exists post_likes_post_id_idx on public.post_likes(post_id);
create index if not exists comment_likes_comment_id_idx on public.comment_likes(comment_id);
create index if not exists reply_likes_reply_id_idx on public.reply_likes(reply_id);

-- ============================================================
-- 8) PERMISSÕES
-- ============================================================
grant select, insert, update, delete on table public.posts to authenticated;
grant select, insert, update, delete on table public.comments to authenticated;
grant select, insert, update, delete on table public.comment_replies to authenticated;
grant select, insert, delete on table public.post_likes to authenticated;
grant select, insert, delete on table public.comment_likes to authenticated;
grant select, insert, delete on table public.reply_likes to authenticated;

-- ============================================================
-- 9) RLS — POSTS
-- ============================================================
alter table public.posts enable row level security;
drop policy if exists "Booklyi feed - view posts" on public.posts;
create policy "Booklyi feed - view posts"
on public.posts for select to authenticated
using (true);

drop policy if exists "Booklyi feed - insert own posts" on public.posts;
create policy "Booklyi feed - insert own posts"
on public.posts for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Booklyi feed - update own posts" on public.posts;
create policy "Booklyi feed - update own posts"
on public.posts for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Booklyi feed - delete own posts" on public.posts;
create policy "Booklyi feed - delete own posts"
on public.posts for delete to authenticated
using (auth.uid() = user_id);

-- ============================================================
-- 10) RLS — COMENTÁRIOS
-- ============================================================
alter table public.comments enable row level security;
drop policy if exists "Booklyi feed - view comments" on public.comments;
create policy "Booklyi feed - view comments"
on public.comments for select to authenticated
using (true);

drop policy if exists "Booklyi feed - insert own comments" on public.comments;
create policy "Booklyi feed - insert own comments"
on public.comments for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Booklyi feed - update own comments" on public.comments;
create policy "Booklyi feed - update own comments"
on public.comments for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Booklyi feed - delete own comments" on public.comments;
create policy "Booklyi feed - delete own comments"
on public.comments for delete to authenticated
using (auth.uid() = user_id);

-- ============================================================
-- 11) RLS — RESPOSTAS
-- ============================================================
alter table public.comment_replies enable row level security;
drop policy if exists "Booklyi feed - view replies" on public.comment_replies;
create policy "Booklyi feed - view replies"
on public.comment_replies for select to authenticated
using (true);

drop policy if exists "Booklyi feed - insert own replies" on public.comment_replies;
create policy "Booklyi feed - insert own replies"
on public.comment_replies for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Booklyi feed - update own replies" on public.comment_replies;
create policy "Booklyi feed - update own replies"
on public.comment_replies for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Booklyi feed - delete own replies" on public.comment_replies;
create policy "Booklyi feed - delete own replies"
on public.comment_replies for delete to authenticated
using (auth.uid() = user_id);

-- ============================================================
-- 12) RLS — CURTIDAS
-- ============================================================
alter table public.post_likes enable row level security;
drop policy if exists "Booklyi feed - view post likes" on public.post_likes;
create policy "Booklyi feed - view post likes"
on public.post_likes for select to authenticated
using (true);

drop policy if exists "Booklyi feed - insert own post likes" on public.post_likes;
create policy "Booklyi feed - insert own post likes"
on public.post_likes for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Booklyi feed - delete own post likes" on public.post_likes;
create policy "Booklyi feed - delete own post likes"
on public.post_likes for delete to authenticated
using (auth.uid() = user_id);

alter table public.comment_likes enable row level security;
drop policy if exists "Booklyi feed - view comment likes" on public.comment_likes;
create policy "Booklyi feed - view comment likes"
on public.comment_likes for select to authenticated
using (true);

drop policy if exists "Booklyi feed - insert own comment likes" on public.comment_likes;
create policy "Booklyi feed - insert own comment likes"
on public.comment_likes for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Booklyi feed - delete own comment likes" on public.comment_likes;
create policy "Booklyi feed - delete own comment likes"
on public.comment_likes for delete to authenticated
using (auth.uid() = user_id);

alter table public.reply_likes enable row level security;
drop policy if exists "Booklyi feed - view reply likes" on public.reply_likes;
create policy "Booklyi feed - view reply likes"
on public.reply_likes for select to authenticated
using (true);

drop policy if exists "Booklyi feed - insert own reply likes" on public.reply_likes;
create policy "Booklyi feed - insert own reply likes"
on public.reply_likes for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Booklyi feed - delete own reply likes" on public.reply_likes;
create policy "Booklyi feed - delete own reply likes"
on public.reply_likes for delete to authenticated
using (auth.uid() = user_id);

-- ============================================================
-- 13) GARANTIA DE DADOS PADRÃO
-- ============================================================
update public.posts set spoiler=false where spoiler is null;
update public.posts set rating=0 where rating is null;
update public.posts set created_at=now() where created_at is null;
update public.comments set created_at=now() where created_at is null;
update public.comment_replies set created_at=now() where created_at is null;
