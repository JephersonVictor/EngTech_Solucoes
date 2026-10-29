# EngTech Soluções em Tecnologia

Site de portfólio construído com React, TypeScript e Vite. As páginas apresentam os serviços, projetos e canais de contato da EngTech.

## Requisitos

- Node.js 22 LTS ou compatível
- npm

## Começar

Na pasta do projeto, instale as dependências e inicie o servidor local:

```powershell
npm install
npm run dev
```

No PowerShell do Windows, se a política de execução bloquear `npm.ps1`, use os comandos equivalentes com `npm.cmd`:

```powershell
npm.cmd install
npm.cmd run dev
```

## Comandos

```powershell
npm run dev      # inicia o servidor de desenvolvimento
npm run build    # verifica os tipos e gera a versão de produção em dist/
npm run preview  # serve localmente a versão gerada
```

No PowerShell do Windows, substitua `npm` por `npm.cmd` caso necessário.

## Páginas

- `index.html`: início
- `servicos.html`: serviços
- `portfolio.html`: portfólio e filtros
- `sobre.html`: sobre a EngTech
- `contato.html`: formulário e canais de contato
- `admin.html`: painel administrativo local

Os HTML são entradas do Vite. O conteúdo e a lógica das páginas ficam em `src/`, e os arquivos estáticos ficam em `public/`.

## API e execução local

Projetos, mensagens e canais são persistidos pela API Express em PostgreSQL. O frontend usa `fetch`; nenhum desses dados fica no `localStorage`. O painel administrativo autentica pela API e mantém somente o token temporário da sessão no `sessionStorage`.

Configure um PostgreSQL local e as variáveis de ambiente do arquivo `.env.example` no terminal. Em PowerShell, por exemplo:

```powershell
$env:DATABASE_URL = "postgres://postgres:senha@localhost:5432/engtech"
$env:ADMIN_PASSWORD = "defina-uma-senha-forte"
$env:ADMIN_TOKEN_SECRET = "gere-um-segredo-aleatorio-com-32-caracteres-ou-mais"
$env:FRONTEND_URL = "http://localhost:5173"
npm.cmd run start:api
```

Em outro terminal, execute `npm.cmd run dev`. O Vite encaminha `/api` para `http://localhost:3000` durante o desenvolvimento.

## Deploy

1. Publique o repositório no GitHub.
2. No Render, crie um Blueprint apontando para o repositório e selecione `render.yaml`. Isso cria a API e o PostgreSQL. Defina `ADMIN_PASSWORD` como uma senha forte e temporária/guardada com segurança. O `ADMIN_TOKEN_SECRET` é gerado pelo Render.
3. Após a API estar no ar, confira `https://SUA-API.onrender.com/api/health`.
4. No serviço da API no Render, defina `FRONTEND_URL` com a origem exata do site Vercel, sem barra final, por exemplo `https://engtech.vercel.app`.
5. Importe o mesmo repositório no Vercel. Use `VITE_API_URL` com a URL da API Render, por exemplo `https://engtech-api.onrender.com`, sem `/api` no final. Faça um novo deploy para incorporar essa variável.

O banco do blueprint usa o plano `basic-256mb` do Render, que pode ter cobrança. Confira os preços e a política de retenção antes de confirmar. Configure domínio próprio em `FRONTEND_URL` se aplicável. O endpoint público de mensagens e o login têm limite de requisições; as rotas administrativas exigem o token emitido pelo login.

O formulário registra a mensagem no banco e, em seguida, abre o aplicativo de e-mail configurado pelo visitante. A API guarda os dados sem autenticação pública para envio; proteja o painel com uma senha forte e não compartilhe o token administrativo.

## Imagens

As versões WebP são usadas nos navegadores compatíveis; os PNGs correspondentes servem como fallback.