# Implementação da revisão — 30/10/2026

Este registro acompanha o PR de reformulação do site. O relatório original contém 24 achados. A tabela distingue correções implementadas das decisões que dependem de material do autor ou infraestrutura externa.

| ID | Tratamento nesta branch |
|---|---|
| 01 | Home com nome, profissão, apresentação e ações antes dos artigos, usando a direção visual entregue. |
| 02 | Texto de exemplo retirado; post não publicado e excluído de feed/busca/listas. URL pública preservada por página de indisponibilidade com navegação útil. O relato original ainda precisa ser recuperado. |
| 03 | Formulário sem serviço e promessa de assinatura removidos; RSS real disponível. URL antiga de newsletter preservada com orientação para RSS. |
| 04 | Busca global por título, conteúdo e categoria, com acentos normalizados, contagem, estado vazio, erro e nova tentativa. Inclui artigos de todas as páginas. |
| 05 | Destinos `#` removidos. Perfil GitHub já configurado e links reais. Contato sem e-mail ou LinkedIn presumidos. |
| 06 | Páginas de Resenhas e Leituras criadas. Todos os destinos internos conferidos no build. |
| 07 | Grades com largura mínima controlada, links do rodapé com quebra e layout validado a partir de 320 px. |
| 08 | Código de nota fixa removido; resenha usa Liquid e não exige JavaScript. |
| 09 | Paleta de texto, datas, ações e código com contraste ajustado; axe executado no HTML renderizado. |
| 10 | Nenhuma das quatro mídias consta do repositório/histórico inspecionado. Referências quebradas substituídas por aviso editorial explícito, preservando a URL original em comentário no Markdown para futura recuperação. As imagens **não foram restauradas**; precisam de backup/exportação. |
| 11 | Tutoriais práticos classificados na categoria existente e exibidos como “Dicas práticas”. Não há categoria vazia na navegação. |
| 12 | Widget social desabilitado. Cliente opcional com texto seguro, validação de URL, timeout, cache e falha discreta. Endpoint AWS não foi alterado nem reativado. |
| 13 | Nota da resenha 10/10 em texto e estrelas usando `nota`. Destino Skoob genérico removido até confirmar a obra. |
| 14 | Até três relacionados de mesma categoria, excluindo o próprio artigo. |
| 15 | H1 em todas as páginas; hierarquia dos títulos antigos corrigida; atalho para conteúdo e indicação da página atual. |
| 16 | Menu com Escape e retorno de foco, fechamento ao sair, foco visível, rótulo na busca e blocos roláveis por teclado. Cópia de código/prompt com tratamento de falha. |
| 17 | Datas, busca, paginação, leitura e categorias da interface em português. |
| 18 | Metadados centralizados no plugin SEO, idioma PT-BR, locale pt_BR e imagem social própria, com SVG editável e PNG 1200 × 630 gerado no build a partir da renderização preservada em base64. |
| 19 | Cabeçalho compacto para artigos sem capa; não há área vazia com altura de viewport. |
| 20 | Monograma explícito na identidade visual e iniciais GC na configuração. Não há foto fictícia. |
| 21 | Curadoria independente do feed, filtros funcionais e página de palestras com materiais existentes. Slides da palestra de IA antes do prompt extenso. |
| 22 | Sobre, Projetos, Palestras, Blog e Contato. Projetos pessoais: código deste site e setup Linux Mint referenciado no acervo. Nenhum caso de cliente, métrica ou senioridade adicionados. |
| 23 | Ruby alinhado entre Docker/CI, Jekyll fixado, lockfiles versionados, importação separada, documentação da API corrigida para AWS e validação automática de PR sem deploy. |
| 24 | 404 personalizada com navegação/busca; permalinks preservados e página compatível para o slug antigo conhecido de Easy Engine. Auditoria exaustiva de URLs antigas depende de exportação/logs. |

## Materiais que continuam dependendo do autor

- Relato original do WordCamp Brasil 2025.
- Quatro arquivos de imagem do WordPress: `hello-world-docker.png`, `image-1.png`, `fazendo-a-compilacao-do-sass-com-compass-via-shell.png`, `programador.jpg`.
- Canal de contato mais direto, foto opcional, URL específica da obra no Skoob e casos de clientes autorizados.
- Mais contexto da palestra de criatividade para expandir o texto além do material já existente.

Essas lacunas não são preenchidas por conteúdo inventado. O site oferece caminhos utilizáveis com o acervo disponível. Tutoriais antigos mantêm avisos de contexto; seus comandos não foram certificados para versões atuais.

## Validação

`npm test` registra a lista de páginas e resultados em `test-results/verification.json` e gera capturas desktop/mobile. O workflow do PR executa `bundle exec jekyll build --strict_front_matter` com o lockfile, seguido da mesma suíte. O artefato de CI inclui `_site` para revisão estática.

Acessibilidade automatizada cobre regras WCAG 2 A/AA, 2.1 AA e boas práticas do axe em páginas representativas. Não equivale a certificação. Foram exercitados menu e navegação sem JS; Safari, leitor de tela e dispositivo físico não foram usados. O teste não envia formulários externos nem depende da API social desabilitada.

Antes de divulgar um QR code, o autor ainda deve conferir a URL no telefone e na rede usados no evento. O PR não mescla a branch nem publica em produção; o merge em `main` mantém o workflow de deploy já existente.
