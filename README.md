# Booklyi V12.7 — Estante real + catálogo ampliado

Base: V12.6.

## O que foi mantido
- Login e sessão real pelo Supabase.
- Perfil e @usuário reais.
- Estante persistida por usuário no Supabase.
- Status de leitura, avaliação, progresso e página atual sincronizados.
- Feed, seguir/deixar de seguir e demais recursos já existentes.

## Catálogo ampliado
- Busca combinando Google Books e Open Library.
- Até 40 resultados consolidados por pesquisa, com deduplicação por título + autor.
- Busca específica por ISBN quando o termo parece ser um ISBN.
- Google Books agora tenta a melhor resolução de capa disponível antes das alternativas.
- Open Library fornece capas adicionais por ID e ISBN.
- Cada resultado sempre terá uma apresentação de capa: quando nenhuma capa real estiver disponível ou todas as fontes falharem, o Booklyi gera uma capa visual própria com título e autor, evitando espaços vazios.

## Observação sobre capas
Nem toda obra existente no mundo possui uma imagem pública de capa disponível nas fontes consultadas. Por isso, a V12.7 garante que nenhum livro fique sem visual de capa no aplicativo, mas a capa gerada não representa necessariamente a capa oficial da editora.

## Próxima evolução
A próxima etapa pode transformar posts, curtidas, comentários e respostas em dados reais do Supabase e, depois, implementar mensagens privadas (DM) entre usuários.
