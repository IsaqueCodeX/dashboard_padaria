# 🥖 Gestão Padaria SA - Sistema ERP

Sistema de gestão empresarial completo para padarias, desenvolvido com React, TypeScript e Tailwind CSS.

[![GitHub](https://img.shields.io/badge/GitHub-IsaqueCodeX-blue?style=flat-square&logo=github)](https://github.com/IsaqueCodeX/dashboard_padaria)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Isaque%20Santos-blue?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/isaque-santos-720b8b15a)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18+-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4+-purple?style=flat-square&logo=vite)](https://vitejs.dev/)

***
## Projeto Online 👉 https://dashboard-padaria.vercel.app/login
***


## ✨ Funcionalidades

- **📊 Dashboard** - Visão geral com KPIs e métricas importantes
- **📦 Gestão de Produtos** - Controle de estoque e catálogo
- **🏢 Fornecedores** - Cadastro e gestão de parceiros
- **💰 Despesas** - Controle financeiro e categorização
- **📈 Relatórios** - Análises e exportações
- **⚙️ Configurações** - Personalização do sistema

## 🚀 Tecnologias

- **React 18** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes reutilizáveis
- **Zustand** - Gerenciamento de estado
- **React Router** - Roteamento
- **React Hook Form** - Manipulação de formulários
- **Zod** - Validação de schemas
- **date-fns** - Utilitários de data
- **Lucide React** - Ícones

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- npm 9+

### Passos

1. **Clone o repositório:**

```bash
git clone https://github.com/IsaqueCodeX/dashboard_padaria.git
cd dashboard_padaria
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

4. **Acesse no navegador:**

```
http://localhost:8080
```

## 🔑 Credenciais de Demonstração

- **Usuário:** admin
- **Senha:** padaria123

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes shadcn/ui
│   ├── layout/         # Componentes de layout
│   └── modals/         # Modais de formulários
├── pages/              # Páginas da aplicação
├── hooks/              # Hooks customizados
├── lib/                # Funções utilitárias
├── store/              # Gerenciamento de estado
├── types/              # Definições de tipos
└── integrations/       # Integrações externas
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build de produção
- `npm run lint` - Executar ESLint

## 🎨 Design System

O projeto utiliza um design system personalizado com:

- **Tema escuro** como padrão com suporte a tema claro
- **Cores da padaria** (laranja, amarelo, verde)
- **Componentes responsivos** e acessíveis
- **Animações suaves** e transições
- **Gradientes** e sombras personalizadas

## 📊 Funcionalidades Principais

### Dashboard

- KPIs em tempo real
- Gráficos de vendas e despesas
- Alertas de estoque
- Produtos mais vendidos
- Dicas de saúde financeira

### Gestão de Produtos

- Cadastro completo de produtos
- Controle de estoque automático
- Categorização e filtros
- Cálculo de margem de lucro
- Status de estoque (em estoque, baixo, zerado)

### Fornecedores

- Cadastro de fornecedores
- Informações de contato
- Produtos fornecidos
- Condições de pagamento
- Validação de CNPJ

### Despesas

- Despesas fixas e variáveis
- Categorização automática
- Vinculação com fornecedores
- Relatórios por período
- Controle de fluxo de caixa

## 🔧 Configuração

O projeto está configurado para:

- **Desenvolvimento** com hot reload
- **Build otimizado** com code splitting
- **Linting** com ESLint
- **TypeScript** com configurações flexíveis
- **Tailwind CSS** com classes personalizadas

## 📱 Responsividade

O sistema é totalmente responsivo e funciona em:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Deploy

Para fazer deploy em produção:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist/` e podem ser servidos por qualquer servidor web estático.

### Deploy no GitHub Pages

```bash
# Instalar gh-pages
npm install --save-dev gh-pages

# Adicionar script no package.json
"deploy": "gh-pages -d dist"

# Fazer deploy
npm run build
npm run deploy
```

### Deploy no Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel
```

### Deploy no Netlify

```bash
# Build do projeto
npm run build

# Upload da pasta dist/ para Netlify
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Desenvolvedor

**Isaque Santos** - Desenvolvedor Full Stack

- 🌐 [GitHub](https://github.com/IsaqueCodeX)
- 💼 [LinkedIn](https://www.linkedin.com/in/isaque-santos-720b8b15a)
- 📧 Email: [contato@isaquesantos.dev](mailto:contato@isaquesantos.dev)

### Sobre o Desenvolvedor

Desenvolvedor Full Stack com experiência em React, Node.js, TypeScript e tecnologias modernas. Especializado em desenvolvimento de aplicações web responsivas e sistemas de gestão empresarial.

## 🎯 Roadmap

- [ ] Sistema de autenticação com JWT
- [ ] Integração com APIs de pagamento
- [ ] Relatórios em PDF
- [ ] Notificações push
- [ ] App mobile (React Native)
- [ ] Integração com sistemas de contabilidade
- [ ] Dashboard em tempo real com WebSockets

## 🐛 Reportar Bugs

Se encontrar algum bug, por favor:

1. Verifique se já existe uma [issue](https://github.com/IsaqueCodeX/dashboard_padaria/issues) sobre o problema
2. Crie uma nova issue com:
   - Descrição detalhada do bug
   - Passos para reproduzir
   - Screenshots se aplicável
   - Informações do ambiente (navegador, OS, etc.)

## 💡 Sugestões

Tem uma ideia para melhorar o projeto? Abra uma [issue](https://github.com/IsaqueCodeX/dashboard_padaria/issues) com a tag `enhancement`!

---

_Sistema desenvolvido para gestão completa de padarias com foco em usabilidade e performance._

⭐ **Se este projeto te ajudou, considere dar uma estrela!**
