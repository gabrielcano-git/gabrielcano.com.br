# API Threads (serverless)

Função serverless em Python que busca seus últimos posts no Threads e devolve JSON para o widget **tail -f social.log** do site.

A API usa a [Threads API](https://developers.facebook.com/docs/threads) (Meta) e retorna apenas posts originais (quote posts são filtrados). O tempo é normalizado em português (ex.: "2 horas atrás", "1 dia atrás").

## Uso na Vercel

1. **Deploy**: ao fazer deploy do repositório na Vercel, a pasta `api/` vira função serverless. A rota fica em **`/api/threads`**.

2. **Variáveis de ambiente** (em Vercel → Project → Settings → Environment Variables):

   | Nome                   | Obrigatório | Descrição                                                                                                                                                       |
   | ---------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `THREADS_ACCESS_TOKEN` | Sim         | Token de acesso da [Threads API](https://developers.facebook.com/docs/threads) (Meta).                                                                          |
   | `THREADS_USER_ID`      | Sim         | ID do usuário no Threads. Com ele definido, usa `{user_id}/threads`. Se não definir `THREADS_USERNAME`, o handler usa `me/threads` (posts do usuário do token). |
   | `THREADS_USERNAME`     | Não         | Username (@) do Threads, usado quando se busca por `THREADS_USER_ID` (opcional).                                                                                |
   | `THREADS_LIMIT`        | Não         | Quantidade de posts a retornar (padrão: 3, mínimo: 1, máximo: 25).                                                                                              |
   | `CORS_ORIGIN`          | Não         | Origin CORS (padrão: `*`). Para restringir: `https://gabrielcano.com.br`.                                                                                       |

3. **No site Jekyll** (`_config.yml`):

   ```yaml
   social_updates_api_url: "https://gabrielcano.com.br/api/threads"
   ```

   (Troque pelo domínio onde o site está publicado.)

## Como obter o token e o User ID (Threads API)

1. Acesse [Meta for Developers](https://developers.facebook.com/) e crie um app (ou use um existente).
2. Adicione o produto **Threads API** ao app.
3. Em **Tools → Graph API Explorer** (ou no fluxo do Threads API), gere um **User Access Token** com a permissão `threads_basic`.
4. Obtenha o **User ID** do Threads conforme a documentação da Meta (ex.: via endpoint de perfil ou no fluxo do Graph API) e defina a variável `THREADS_USER_ID`.
5. Para ver **seus** posts: use o token e o mesmo `THREADS_USER_ID` (o handler usa `me/threads` quando `THREADS_USERNAME` não está definido).

Tokens de usuário expiram; para produção você pode usar refresh token ou um token de longa duração conforme a documentação da Meta.

## Resposta da API

JSON array no formato esperado pelo widget. Cada item inclui `text`, `time` (relativo em português) e `link` (permalink do post):

```json
[
  {
    "text": "Primeiro post...",
    "time": "2 horas atrás",
    "link": "https://www.threads.net/..."
  },
  {
    "text": "Segundo post...",
    "time": "1 dia atrás",
    "link": "https://www.threads.net/..."
  }
]
```

Em caso de erro de configuração (ex.: token ou user id ausente), a API retorna status 500 com body `{"error": "Missing configuration: ..."}`. Erros na chamada à Threads API retornam status 502 com `{"error": "..."}`.

## Rodar em ambiente local (teste)

Não é obrigatório ter `requirements.txt` (a função usa só bibliotecas padrão). Para testar a lógica:

```bash
cd api
export THREADS_ACCESS_TOKEN="seu_token"
export THREADS_USER_ID="seu_user_id"
export THREADS_USERNAME="seu_user"   # opcional
python3 -c "
from threads import fetch_threads
import os
items = fetch_threads(
    os.environ['THREADS_ACCESS_TOKEN'],
    os.environ['THREADS_USER_ID'],
    username=os.environ.get('THREADS_USERNAME'),
    limit=3
)
print(items)
"
```

Para testar o handler HTTP localmente, use um adapter (por exemplo [vercel dev](https://vercel.com/docs/cli/dev)) ou exponha a mesma lógica via Flask/FastAPI e chame `GET /api/threads`. O handler expõe a função `lambda_handler(event, context)` (compatível com AWS Lambda / API Gateway).
