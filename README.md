# Booklyi V12.4 — @usuário + Estante real (Supabase)

Base: Booklyi V12.3.

## Novidades
- Permite alterar o `@usuário` no Editar perfil.
- Verifica se o novo @usuário já pertence a outra conta antes de salvar.
- Mantém o nome, bio e foto do perfil.
- A Estante passa a sincronizar com `public.shelf_items` para o usuário autenticado.
- Ao entrar, a estante é carregada do Supabase.
- Adicionar, editar, avaliar, atualizar progresso e remover livros sincroniza com o banco.
- `Lendo agora` passa a refletir a estante carregada do banco.
- Cache do PWA atualizado.

## Importante — executar uma vez no Supabase
Abra o SQL Editor e execute o arquivo `BOOKLYI_V12_4_Supabase_Migration.sql` incluído neste ZIP.

Ele:
- cria um índice único para `profiles.username` (sem duplicar valores preenchidos);
- concede ao papel `authenticated` os privilégios necessários em `shelf_items`;
- garante RLS e políticas para cada usuário acessar somente a própria estante.

> A migração pressupõe que a tabela `public.shelf_items` já foi criada pelo SQL grande do Booklyi. Ela não apaga dados nem recria a tabela.

## Vercel
Mantém as mesmas variáveis:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`


## V12.5 — Estante polida
- Botões Livro/Instagram ajustados para caberem nos cards.
- Avaliação por estrelas com atualização otimista, sem esperar o banco para atualizar a interface.
- Progresso com atualização imediata e salvamento com pequeno debounce para evitar várias requisições enquanto o slider é arrastado.
- Campo de página atual e porcentagem na página de detalhes da leitura, sincronizados entre si.
