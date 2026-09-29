# Booklyi V12 — Login e usuários reais (Supabase)

Base preservada do Booklyi V11.1, com integração inicial ao Supabase.

## Nesta versão
- login por e-mail e senha;
- cadastro real via Supabase Auth;
- perfil real salvo em `profiles`;
- descoberta de outros perfis reais;
- seguir/deixar de seguir perfis reais usando `follows`;
- sessão persistente e logout;
- catálogo, estante, Lendo Agora, posts, comentários, temas e demais recursos existentes preservados.

## Vercel
Requer as variáveis de ambiente:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

> Nesta etapa, autenticação/perfis/follows já usam Supabase. A migração de estante, posts, likes e comentários para o banco deve ser feita na etapa seguinte, para reduzir risco de regressão.
