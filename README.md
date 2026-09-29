# Booklyi V12.6 — Progresso sincronizado

Base: V12.5.

## Correções
- Tela de detalhe e tela "Editar leitura" agora sincronizam página atual e porcentagem.
- Alterar porcentagem calcula automaticamente a página atual quando há total de páginas.
- Alterar página calcula automaticamente a porcentagem.
- Livros marcados como Lido passam para 100% e, quando o total de páginas existe, para a última página.
- Ao reduzir um livro que estava Lido, ele volta para Lendo e limpa a data de término.
- Corrigida duplicidade da função de atualização de progresso que fazia a tela de detalhe não refletir corretamente as alterações.
- Após salvar uma leitura pelo modal de edição, a tela de detalhe aberta é reconstruída com os dados atualizados.
- Mantida a persistência no Supabase da V12.4/V12.5.

## DM
Mensagens privadas entre usuários ficam previstas para uma próxima etapa. A implementação será feita com conversas e mensagens no Supabase, com RLS para que somente participantes possam ler/enviar mensagens.
