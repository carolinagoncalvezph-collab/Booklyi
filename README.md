# Booklyi V12.8.1 — Feed Social Robust

Correção incremental da V12.8 para a publicação do feed.

- A publicação agora grava um retrato do livro diretamente em `posts`, para não depender da inserção em `books`.
- `book_id` continua opcional e é usado quando o vínculo com `books` estiver disponível.
- O feed consegue reconstruir livro, autor e capa a partir dos dados salvos na publicação.
- Mantém login, perfil, estante, progresso, página atual, estrelas, catálogo real e recursos sociais da V12.8.

## Supabase
Execute `BOOKLYI_V12_8_1_Feed_Supabase.sql` no SQL Editor. O script é idempotente.


## V12.8.2 — Avaliações com meia estrela
- Média das estrelas passa a ser calculada apenas com livros realmente avaliados.
- Sem avaliações, a média aparece como "—".
- Avaliações aceitam incrementos de 0,5 a 5,0 estrelas na estante e em novas publicações.
- O cache do PWA foi atualizado para carregar a nova interface.
