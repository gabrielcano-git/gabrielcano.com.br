# Site pessoal de Gabriel Cano

Jekyll 4.3.4, Ruby 3.3.8 e Bundler 2.6.7. Conteúdo em português, sem framework de JavaScript ou API necessária para navegar.

## Desenvolvimento

```sh
bundle install
bundle exec jekyll serve --livereload
```

Abra http://localhost:4000. Alternativa com Docker (mesma versão de Ruby e o mesmo lockfile):

```sh
docker compose up --build
```

O container atende em `0.0.0.0:4000`, sem incluir rascunhos por padrão. O `Gemfile.lock` faz parte do repositório; atualizações de gems devem passar pelo PR.

## Build e validação

```sh
JEKYLL_ENV=production bundle exec jekyll build --strict_front_matter
npm ci
npx playwright install --with-deps chromium
npm test
```

A suíte serve `_site` em uma porta local temporária. Verifica todas as páginas geradas e seus destinos internos, uma ocorrência de título/descrição/H1, filtros, busca global, falha/recuperação da busca, nota da resenha, menu com teclado, navegação sem JS e páginas representativas em sete larguras com axe. Evidências ficam em `test-results/`.

O workflow **Validate site** executa essas verificações em PRs para `main` e disponibiliza o HTML estático e as capturas no artefato `site-review`. Baixe o artefato, sirva a pasta `_site` com um servidor estático e revise no navegador. A validação de PR não publica em produção.

O workflow **Deploy Jekyll site to Pages** publica pushes em `main` e execuções manuais. Mesclar o PR aciona essa publicação; a revisão humana deve ocorrer antes do merge.

## Conteúdo e curadoria

- Artigos: `_posts`; URLs originais com data são preservadas.
- Palestras: `_data/talks.yml`, com links para o post e o material real.
- Artigos destacados: slugs em `_data/highlights.yml`; independentes da cronologia.
- `/blog/` contém a primeira página cronológica; `/page/2/` e `/page/3/` preservam a paginação existente.
- Busca: `search.json` gerado em build inclui todo o acervo publicado. Não inclui o aviso do WordCamp 2025 nem rascunhos.
- Categorias: cada categoria nova deve ter sua página em `categoria/`.
- Datas e textos da interface: PT-BR; SEO centralizado em `jekyll-seo-tag`.
- Imagem social: `assets/images/social-card.svg` é a fonte editável; `_data/social-card.b64` preserva a renderização raster de 1200 × 630 em texto; o hook `_plugins/social_card.rb` gera o PNG no build. Para atualizar, renderize o SVG no navegador em 1200 × 630 e atualize o base64 com `base64 -w 0 social-card.png > _data/social-card.b64`.
- Foto, e-mail, LinkedIn e casos de clientes só devem ser adicionados com dados confirmados. O contato atual usa o GitHub já configurado, e o portfólio contém apenas projetos pessoais verificáveis.

A classificação “Dicas práticas” agrupa textos práticos do acervo. Avisos nos tutoriais antigos preservam a data e o contexto; não representam uma revisão técnica dos comandos para versões atuais.

## Arquivo e migração

As ferramentas de importação foram separadas das dependências de produção:

```sh
BUNDLE_GEMFILE=tools/Gemfile bundle install
BUNDLE_GEMFILE=tools/Gemfile bundle exec ruby import.rb
```

A importação requer os dados da fonte descritos no script; faça backup do acervo e confira o diff antes de aplicar o resultado. Ela não deve fazer parte do deploy normal.

Veja [o registro das 24 recomendações](docs/revisao-implementada.md) para decisões editoriais, materiais ausentes e limites de validação.

## Integração social opcional

O widget está desabilitado. A função em `api/threads.py` é um handler AWS Lambda; GitHub Pages não executa Python. Consulte [a documentação da API](api/README.md). A correção de infraestrutura do endpoint não faz parte da publicação estática.

## Referências visuais anteriores

- [Figma](https://www.figma.com/design/b7YnzvMZyV0CZOkRFQuCue/Meu-Blog-2026)
- [Stitch](https://stitch.withgoogle.com/projects/5080694899183780218)
