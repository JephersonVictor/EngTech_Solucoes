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

## Dados locais

Projetos, mensagens e canais são armazenados no `localStorage` do navegador, nas chaves `engtech_projects`, `engtech_messages` e `engtech_socials`. Esses dados não são compartilhados entre dispositivos nem enviados a um servidor. O formulário registra a mensagem no navegador e prepara um e-mail usando o aplicativo configurado pelo visitante.

O painel administrativo é apenas uma demonstração client-side. A validação no navegador não protege dados ou operações em um site publicado; para uso real, seria necessário autenticar e persistir os dados em um servidor.

## Imagens

As versões WebP são usadas nos navegadores compatíveis; os PNGs correspondentes servem como fallback.