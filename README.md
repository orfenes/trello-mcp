# trello-mcp

Servidor [MCP](https://modelcontextprotocol.io) (Model Context Protocol) que conecta assistentes de IA ao Trello. Com ele é possível listar quadros, listas e cards, além de criar novos cards.

A comunicação é feita via **stdio**, e o servidor usa a [API REST do Trello](https://developer.atlassian.com/cloud/trello/rest/).

## Ferramentas

| Ferramenta | Descrição | Parâmetros |
| --- | --- | --- |
| `listBoards` | Lista todos os quadros do usuário autenticado. | nenhum |
| `list_list` | Lista as listas de um quadro. | `boardId` (obrigatório) |
| `list_cards` | Lista os cards de um quadro. | `boardId` (obrigatório) |
| `create_card` | Cria um card em uma lista. | `listId` (obrigatório), `name` (obrigatório), `description` (opcional) |

As respostas são devolvidas como texto em formato JSON.

O fluxo típico para criar um card é:

1. `listBoards` para obter o `boardId`;
2. `list_list` para obter o `listId`;
3. `create_card` com o `listId` e o nome do card.

## Requisitos

- Node.js 20 ou superior
- Uma conta no Trello com API key e token

## Instalação

Dentro da pasta do projeto:

```bash
npm install
```

## Configuração

### 1. Obtenha as credenciais do Trello

1. Acesse <https://trello.com/power-ups/admin> e crie um Power-Up (ou abra um existente).
2. Na aba **API Key**, gere e copie a chave.
3. Ao lado da chave, use o link para gerar um **Token** e autorize o acesso à sua conta.

### 2. Defina as variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Preencha o `.env`:

```env
TRELLO_API_KEY=sua_api_key
TRELLO_TOKEN=seu_token
```

| Variável | Descrição |
| --- | --- |
| `TRELLO_API_KEY` | Chave de API do Trello |
| `TRELLO_TOKEN` | Token de acesso da sua conta |

> **Atenção:** o token dá acesso à sua conta do Trello. Não o compartilhe nem o envie para o repositório (o `.env` já está no `.gitignore`).

## Uso em um cliente MCP

O cliente MCP é quem inicia o servidor. Nos exemplos abaixo, substitua `/caminho/para/trello-mcp` pelo caminho absoluto do projeto.

As credenciais são passadas na configuração do cliente porque o arquivo `.env` é lido a partir do diretório em que o processo é iniciado, que nem sempre é a pasta do projeto.

### Claude Code

```bash
claude mcp add trello \
  --env TRELLO_API_KEY=sua_api_key \
  --env TRELLO_TOKEN=seu_token \
  -- /caminho/para/trello-mcp/node_modules/.bin/tsx /caminho/para/trello-mcp/src/index.ts
```

### Claude Desktop e outros clientes

Adicione ao arquivo de configuração do cliente (no Claude Desktop, `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "trello": {
      "command": "/caminho/para/trello-mcp/node_modules/.bin/tsx",
      "args": ["/caminho/para/trello-mcp/src/index.ts"],
      "env": {
        "TRELLO_API_KEY": "sua_api_key",
        "TRELLO_TOKEN": "seu_token"
      }
    }
  }
}
```

Depois de salvar, reinicie o cliente.

## Desenvolvimento

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor com `tsx`, lendo o `.env` da pasta atual |
| `npm run typecheck` | Verifica os tipos sem gerar arquivos |

Ao rodar `npm run dev`, o processo fica aguardando mensagens MCP pela entrada padrão. Para testar as ferramentas de forma interativa, use o [MCP Inspector](https://github.com/modelcontextprotocol/inspector):

```bash
npx @modelcontextprotocol/inspector npm run --silent dev
```

### Estrutura do projeto

```
src/
├── index.ts          # Cria o servidor MCP e registra as ferramentas
├── trello.ts         # Cliente HTTP da API do Trello e leitura das credenciais
└── tools/
    ├── boards.ts     # listBoards
    └── cards.ts      # list_cards, create_card, list_list
```

## Solução de problemas

| Erro | Causa provável |
| --- | --- |
| `Variável TRELLO_API_KEY não configurada.` (ou `TRELLO_TOKEN`) | A variável não foi definida na configuração do cliente nem no `.env` |
| `Trello API error: 401` | API key ou token inválido, expirado ou revogado |
| `Trello API error: 400` ou `404` | `boardId` ou `listId` incorreto |

## Licença

ISC
