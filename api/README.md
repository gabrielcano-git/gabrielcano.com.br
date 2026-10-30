# API de atualizações do Threads

`threads.py` contém `lambda_handler(event, context)` para **AWS Lambda / API Gateway** e usa a biblioteca padrão do Python. Não é um handler Vercel. O site é estático no GitHub Pages; a pasta `api` é excluída do build público.

O endpoint configurado no Jekyll é `https://gg6lcn3961.execute-api.us-east-1.amazonaws.com/default/threads-api`. A revisão de 30/10/2026 encontrou resposta 403. Nenhuma alteração de infraestrutura, token ou CORS foi realizada neste PR.

## Configuração do handler

| Variável | Uso |
|---|---|
| `THREADS_ACCESS_TOKEN` | Token do proprietário autorizado; necessário. |
| `THREADS_USER_ID` | Identificador usado quando `THREADS_USERNAME` está definido; caso contrário usa `me/threads`. |
| `THREADS_USERNAME` | Opcional; ativa o uso de `THREADS_USER_ID`. |
| `THREADS_LIMIT` | Quantidade desejada; padrão 3. |
| `CORS_ORIGIN` | Origem permitida; padrão do código `*`. |

As credenciais devem ficar na configuração da função, nunca no Jekyll ou no Git. Tokens e permissões precisam ser administrados pelo responsável pelo aplicativo Meta.

O handler responde a GET/OPTIONS no formato proxy do API Gateway. O cliente espera um array de objetos `{text, time, link}`. Erros de configuração retornam 500; falhas na origem retornam 502.

## Reativação no site

1. Investigue o 403 no API Gateway/Lambda e a validade do token usando os registros do serviço.
2. Valide GET e OPTIONS a partir da origem HTTPS do site e confirme CORS.
3. Configure `social_updates_enabled: true` e inclua `{% include social-updates.html %}` no local desejado do layout.
4. Teste resposta vazia, indisponibilidade e URLs inválidas antes de publicar.

O cliente usa `textContent` e URLs HTTP(S), limita a três itens, aplica timeout de cinco segundos, cache de sessão de cinco minutos e oculta o bloco quando indisponível. A leitura do blog não depende desse serviço.
