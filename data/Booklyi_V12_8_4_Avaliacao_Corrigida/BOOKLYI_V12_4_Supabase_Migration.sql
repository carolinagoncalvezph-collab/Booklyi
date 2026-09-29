-- Booklyi V12.4 — @usuário + Estante real
-- Execute UMA VEZ no Supabase SQL Editor.

-- @usuário: evita duplicidade entre perfis preenchidos.
create unique index if not exists profiles_username_unique
on public.profiles (username)
where username is not null;

-- Privilégios de tabela usados pelo cliente autenticado.
grant select, insert on table public.books to authenticated;
grant select, insert, update, delete on table public.shelf_items to authenticated;

-- RLS da estante: cada usuário acessa somente a própria estante.
alter table public.shelf_items enable row level security;

drop policy if exists "Users can view own shelf" on public.shelf_items;
create policy "Users can view own shelf"
on public.shelf_items for select to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own shelf" on public.shelf_items;
create policy "Users can insert own shelf"
on public.shelf_items for insert to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own shelf" on public.shelf_items;
create policy "Users can update own shelf"
on public.shelf_items for update to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own shelf" on public.shelf_items;
create policy "Users can delete own shelf"
on public.shelf_items for delete to authenticated
using (auth.uid() = user_id);
