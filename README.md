# GestFood — Frontend

Visão geral
-----------
Frontend em React + TypeScript + Vite para o sistema GestFood (cardápio, pedidos, carrinho). Projeto organizado para consumir uma API REST definida pela variável de ambiente VITE_API_URL.

Tecnologias
----------
- React + TypeScript
- Vite
- Axios
- CSS modular (arquivos por componente)
- ESLint + TypeScript

Pré-requisitos
--------------
- Node.js (>= 16 recomendado)
- npm (ou yarn/pnpm)
- Backend da API rodando e acessível via VITE_API_URL

Instalação
---------
No diretório do projeto (ex.: c:\Users\1AnyMan\Documents\Projeto GestFood\gestfood-front):

Windows (PowerShell / CMD):
```powershell
npm install
```

Executando em modo desenvolvimento
---------------------------------
```powershell
npm run dev
```

Build de produção
-----------------
```powershell
npm run build
npm run preview
```

Lint
----
```powershell
npm run lint
```

Variáveis de ambiente
---------------------
Criar um arquivo `.env` na raiz com pelo menos:
```
VITE_API_URL=http://localhost:3000/api
```
No código:
- BASE_URL é lida de import.meta.env.VITE_API_URL (em src/services/env.ts)
- IMAGES_URL = `${BASE_URL}/images` para montar URLs de imagens

Estrutura principal (src/)
--------------------------
- App.tsx — rotas e configuração das páginas
- main.tsx — entrada da aplicação (ReactDOM.createRoot + BrowserRouter)
- layout/
  - Main.tsx — layout global (Header + Outlet + Footer)
- components/
  - button/ChangeTheme.tsx + changetheme.css — alternador de tema (salva preferência)
  - image/Image.tsx — componente que monta URL de imagem usando IMAGES_URL
  - ui/
    - header/Header.tsx + header.css — cabeçalho e navegação
    - footer/Footer.tsx + footer.css — rodapé
    - card/Card.tsx + card.css — card de produto (controle de quantidade + adicionar)
- pages/
  - Home.tsx — home
  - Menu.tsx — exibe lista de produtos (usa product.service)
  - Cart.tsx — carrinho (simulação de itens)
  - PageNotFound.tsx — 404
- services/
  - api.ts — instância axios configurada com BASE_URL
  - env.ts — exporta BASE_URL e IMAGES_URL
  - product.service.ts — funções CRUD de produtos (getAllProducts, getProductById, create, update, delete)
  - order.service.ts, client.service.ts, employee.service.ts, desk.service.ts — serviços análogos
- types/
  - product.d.ts, order.d.ts, employee.d.ts, desk.d.ts, client.d.ts — interfaces/types TS
- utils/
  - format.ts — helpers (ex.: formatMoney)
- styles/
  - globals.css — estilos globais (tema dark por padrão)
  - menu.css — estilos da página Menu
- context/, features/, hooks/ — pasta preparada para lógica de estado, hooks e features (vazia/expansível)

Principais fluxos e responsabilidades
------------------------------------
- Menu.tsx busca produtos via product.service.getAllProducts() e renderiza Card.
- Card usa Image para montar src (IMAGES_URL + filename) e formatMoney para formatar preços.
- ChangeTheme alterna CSS custom properties e persiste preferência em localStorage.
- api.ts cria instância axios com BASE_URL e pode ser importado pelos serviços.
- Tipagem consistente usando arquivos em src/types.

Como trabalhar com imagens
--------------------------
1. Defina VITE_API_URL apontando para seu backend.
2. Em runtime, Image.tsx monta `${IMAGES_URL}/${fileName}` (IMAGES_URL = `${BASE_URL}/images`).
3. Certifique-se de que o backend exponha as imagens nesse path.

Boas práticas e recomendações
----------------------------
- Adicionar tratamento de erros nos services (try/catch + feedback ao usuário).
- Centralizar estado do carrinho (Context/Redux/Zustand) para persistência entre páginas.
- Validar e tipar respostas da API (usar zod ou ajv se necessário).
- Escrever testes unitários para services e componentes críticos.
- Revisar CORS e rota de imagens no backend para produção.

Execução e depuração (Windows)
------------------------------
- Abrir VS Code no diretório do projeto:
```powershell
code .
```
- Rodar dev server:
```powershell
npm run dev
```
- Ver logs/erros no terminal integrado e na aba "Output" do VS Code.

Contribuindo
------------
1. Fork e branch por feature: `feature/<nome>`
2. Mantener lint e formato (formatador/ESLint)
3. Pull request com descrição clara das mudanças e screenshots se UI for alterada

Licença
-------
Adicionar arquivo LICENSE na raiz conforme necessário (ex.: MIT).

Contato
-------
Manter informação de contato/comunicação no repositório principal conforme políticas da equipe.

Notas finais
------------
Este README descreve a versão atual do frontend localizado em src/. Posso gerar templates de scripts, adicionar exemplos de requests para cada service ou criar documentação automática (OpenAPI client snippets) se desejar.
# gestfood-front
