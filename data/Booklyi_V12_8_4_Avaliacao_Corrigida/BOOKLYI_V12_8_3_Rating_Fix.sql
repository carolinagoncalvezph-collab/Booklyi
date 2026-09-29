-- Booklyi V12.8.3 — separa avaliações do usuário de valores legados/comunitários.
-- Execute UMA VEZ no Supabase SQL Editor.

alter table public.shelf_items
  add column if not exists has_user_rating boolean not null default false;

-- Valores antigos não marcados explicitamente como avaliação do usuário não entram na média.
update public.shelf_items
set has_user_rating = false
where has_user_rating is null;

-- Garante a regra de meia estrela para avaliações do usuário.
alter table public.shelf_items drop constraint if exists shelf_items_rating_half_check;
alter table public.shelf_items
  add constraint shelf_items_rating_half_check
  check (rating is null or (rating >= 0 and rating <= 5 and rating * 2 = trunc(rating * 2)));

-- Mantém posts com avaliações em incrementos de 0,5.
alter table public.posts drop constraint if exists posts_rating_half_check;
alter table public.posts
  add constraint posts_rating_half_check
  check (rating is null or (rating >= 0 and rating <= 5 and rating * 2 = trunc(rating * 2)));
