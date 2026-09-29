-- Booklyi V12.8.2 — avaliações de 0,5 em 0,5
-- Execute UMA VEZ no Supabase SQL Editor.
-- Converte ratings da estante e dos posts para numeric(2,1).

alter table public.shelf_items
  alter column rating type numeric(2,1)
  using case when rating is null then null else rating::numeric end;

alter table public.posts
  alter column rating type numeric(2,1)
  using case when rating is null then null else rating::numeric end;

-- Normaliza qualquer valor legado para a meia-estrela mais próxima.
update public.shelf_items
set rating = round(rating * 2) / 2
where rating is not null;

update public.posts
set rating = round(rating * 2) / 2
where rating is not null;

-- Permite apenas valores de 0 a 5 em incrementos de 0,5.
alter table public.shelf_items drop constraint if exists shelf_items_rating_half_check;
alter table public.shelf_items
  add constraint shelf_items_rating_half_check
  check (rating is null or (rating >= 0 and rating <= 5 and rating * 2 = trunc(rating * 2)));

alter table public.posts drop constraint if exists posts_rating_half_check;
alter table public.posts
  add constraint posts_rating_half_check
  check (rating is null or (rating >= 0 and rating <= 5 and rating * 2 = trunc(rating * 2)));
