# Booklyi V12.8.6

Correção consolidada do Feed + Catálogo + Avaliação.

Principais ajustes:
- restaura o bloco de estilos do perfil e elimina o conflito de CSS que desconfigurava publicações;
- avaliação refeita com 5 controles fixos, 0,5 em 0,5, sem áreas sobrepostas;
- estrelas de visualização compactas, sem distribuição pelo card;
- posts de perfil não exibem estrelas vazias quando não há avaliação;
- catálogo com fallback local para buscas comuns e títulos de Harry Potter, além da API real;
- API de livros com normalização, timeout e correspondência local antes dos provedores externos;
- cache do PWA atualizado.

Para atualizar um projeto já existente no GitHub, substitua:
- `public/index.html`
- `public/sw.js`
- `pages/api/books.js`
- `package.json` (versão 12.8.6)

Não há SQL novo nesta versão.
