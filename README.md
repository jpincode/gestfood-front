# 🍽️ GestFood - Frontend

Sistema de gestão para restaurantes desenvolvido com React e TypeScript. O GestFood oferece uma solução completa para gerenciamento de pedidos, cardápio digital, controle de mesas e administração de funcionários.

## 📋 Sobre o Projeto

GestFood é uma aplicação web moderna para gestão de restaurantes que permite:
- **Clientes**: Visualizar cardápio, fazer pedidos e acompanhar status
- **Administradores**: Gerenciar produtos, pedidos, funcionários, clientes e mesas

## ✨ Funcionalidades

### Para Clientes
- 🔐 **Autenticação**: Sistema de login seguro
- 📱 **Cardápio Digital**: Navegação intuitiva pelo menu do restaurante
- 🛒 **Carrinho de Compras**: Adicionar e gerenciar itens do pedido
- 📦 **Acompanhamento de Pedidos**: Visualizar histórico e status dos pedidos

### Para Administradores
- 📊 **Dashboard Completo**: Visão geral do negócio
- 🍕 **Gestão de Produtos**: CRUD completo de itens do cardápio
- 📋 **Gestão de Pedidos**: Controle e atualização de status
- 👥 **Gestão de Clientes**: Cadastro e gerenciamento de clientes
- 🪑 **Gestão de Mesas**: Controle de mesas e ocupação
- 👨‍💼 **Gestão de Funcionários**: Cadastro e gerenciamento da equipe

## 🛠️ Tecnologias Utilizadas

### Core
- **React 19.2.0** - Biblioteca para construção de interfaces
- **TypeScript 5.9.3** - Superset JavaScript com tipagem estática
- **Vite 7.2.4** - Build tool e dev server

### Roteamento e Estado
- **React Router DOM 7.10.0** - Gerenciamento de rotas
- **Context API** - Gerenciamento de estado global (Cart, Client)

### Requisições HTTP
- **Axios 1.13.2** - Cliente HTTP para comunicação com API

### UI e Ícones
- **Lucide React 0.555.0** - Biblioteca de ícones

### Desenvolvimento
- **ESLint** - Linter para qualidade de código
- **TypeScript ESLint** - Regras ESLint para TypeScript

## 📁 Estrutura do Projeto

```
gestfood-front/
├── src/
│   ├── assets/              # Recursos estáticos (imagens, ícones)
│   ├── components/          # Componentes reutilizáveis
│   │   ├── button/          # Botões (ex: ChangeTheme)
│   │   ├── image/           # Componente de imagem
│   │   └── ui/              # Componentes de UI
│   │       ├── admin/       # Componentes do admin (Header, Footer, Sidebar, Layout)
│   │       ├── card/        # Componente de card
│   │       ├── footer/      # Footer público
│   │       └── header/      # Header público
│   ├── context/             # Context API providers
│   │   ├── CartContext.tsx  # Gerenciamento do carrinho
│   │   └── ClientContext.tsx # Gerenciamento de autenticação
│   ├── features/            # Funcionalidades principais
│   │   ├── dashboard/       # Dashboard administrativo
│   │   │   ├── MainDash.tsx # Dashboard principal
│   │   │   ├── clients/     # Gestão de clientes
│   │   │   ├── desks/       # Gestão de mesas
│   │   │   ├── employees/   # Gestão de funcionários
│   │   │   ├── orders/      # Gestão de pedidos
│   │   │   └── products/    # Gestão de produtos
│   │   └── login/           # Tela de login
│   ├── layout/              # Layouts da aplicação
│   ├── pages/               # Páginas principais
│   │   ├── Cart.tsx         # Página do carrinho
│   │   ├── Menu.tsx         # Página do cardápio
│   │   ├── Orders.tsx       # Página de pedidos
│   │   └── PageNotFound.tsx # Página 404
│   ├── services/            # Serviços de API
│   │   ├── api.ts           # Configuração do Axios
│   │   ├── client.service.ts
│   │   ├── desk.service.ts
│   │   ├── employee.service.ts
│   │   ├── order.service.ts
│   │   ├── product.service.ts
│   │   └── env.ts           # Variáveis de ambiente
│   ├── styles/              # Estilos globais
│   ├── App.tsx              # Componente principal com rotas
│   └── main.tsx             # Ponto de entrada da aplicação
├── public/                  # Arquivos públicos
├── .env                     # Variáveis de ambiente
├── index.html               # HTML principal
├── package.json             # Dependências e scripts
├── tsconfig.json            # Configuração TypeScript
├── vite.config.ts           # Configuração Vite
└── README.md                # Este arquivo
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Backend da aplicação rodando (API)

### Passos para Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd gestfood-front
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=(sua_api_url)
```

> Ajuste a URL da API conforme necessário

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 📜 Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Compilar TypeScript e criar build de produção
npm run build

# Executar linter
npm run lint

# Visualizar build de produção
npm run preview
```

## 🔐 Autenticação e Rotas

### Rotas Públicas
- `/login` - Tela de login (redireciona para `/cardapio` se já autenticado)

### Rotas Protegidas (Requer Autenticação)
- `/cardapio` - Cardápio digital
- `/carrinho` - Carrinho de compras
- `/pedidos` - Histórico de pedidos

### Rotas Administrativas
- `/admin/*` - Dashboard administrativo (acesso livre)
  - `/admin/products` - Gestão de produtos
  - `/admin/orders` - Gestão de pedidos
  - `/admin/clients` - Gestão de clientes
  - `/admin/desks` - Gestão de mesas
  - `/admin/employees` - Gestão de funcionários

### Outras Rotas
- `/error404` - Página de erro 404
- `*` - Rotas não encontradas redirecionam para `/error404`

## 🎨 Temas

A aplicação possui suporte a temas claro/escuro através do componente `ChangeTheme`.

## 🔄 Gerenciamento de Estado

### CartContext
Gerencia o estado do carrinho de compras:
- Adicionar/remover itens
- Atualizar quantidades
- Calcular totais

### ClientContext
Gerencia a autenticação e dados do cliente:
- Estado de login (`isLoggedIn`)
- ID do cliente (`clientId`)
- Informações do usuário

## 🌐 Integração com API

Todos os serviços estão localizados em `src/services/` e utilizam Axios para comunicação com o backend:

- **client.service.ts** - Operações relacionadas a clientes
- **desk.service.ts** - Operações relacionadas a mesas
- **employee.service.ts** - Operações relacionadas a funcionários
- **order.service.ts** - Operações relacionadas a pedidos
- **product.service.ts** - Operações relacionadas a produtos

A URL base da API é configurada através da variável de ambiente `VITE_API_URL`.

## 🧪 Desenvolvimento

### Estrutura de Componentes
- Componentes reutilizáveis em `src/components/`
- Features específicas em `src/features/`
- Páginas principais em `src/pages/`

### Estilização
- CSS modular por componente
- Estilos globais em `src/styles/globals.css`
- Arquivos CSS específicos junto aos componentes

### Boas Práticas
- Tipagem TypeScript em todos os componentes
- Componentização e reutilização de código
- Separação de responsabilidades (UI, lógica, serviços)
- Context API para estado global

## 📝 Convenções de Código

- **Componentes**: PascalCase (ex: `Menu.tsx`, `CartContext.tsx`)
- **Serviços**: camelCase com sufixo `.service.ts` (ex: `product.service.ts`)
- **Estilos**: camelCase com sufixo `.css` (ex: `header.css`)
- **Constantes**: UPPER_SNAKE_CASE

## 🐛 Troubleshooting

### Erro de conexão com API
Verifique se:
1. O backend está rodando
2. A variável `VITE_API_URL` no `.env` está correta
3. Não há problemas de CORS

### Problemas com dependências
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e de uso interno.

## 👥 Equipe

Desenvolvido por João Paulo.

---

**Nota**: Este é um projeto em desenvolvimento ativo. Funcionalidades e documentação podem ser atualizadas frequentemente.
