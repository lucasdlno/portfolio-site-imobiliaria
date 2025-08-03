
# Projeto Gomes Imóveis - Uma Plataforma Full-Stack para um Negócio Real

## 🚀 Acesse o Site Online
**[Clique aqui para ver o projeto em produção!](https://site-imobiliaria-jet.vercel.app)** 

---

## 📖 Sobre o Projeto

Este projeto nasceu de uma necessidade real e de uma oportunidade de aprendizado. Meu avô, um corretor de imóveis, precisava de uma plataforma digital moderna para apresentar seu portfólio de imóveis de forma profissional. Aceitei o desafio de construir essa solução do zero, utilizando o projeto como um campo prático para aprofundar e aplicar meus conhecimentos em desenvolvimento web full-stack.

O resultado é a **"Gomes Imóveis"**, uma aplicação web completa, funcional e escalável. Ela serve não apenas como uma vitrine pública para os imóveis, mas também como uma ferramenta de gerenciamento de conteúdo (CMS) para o corretor, que pode adicionar, editar e remover propriedades através de um painel de administrador seguro e intuitivo.

## ✨ Funcionalidades

### Área Pública (Frontend)
- **Home Page Dinâmica:** Apresenta os imóveis mais recentes com um sistema de "Carregar Mais".
- **Busca de Imóveis:** Página com listagem completa, paginação e preparada para futuros filtros.
- **Página de Detalhes do Imóvel:** Visualização completa de cada propriedade, com galeria de fotos interativa e um botão de contato direto via WhatsApp.
- **Design Totalmente Responsivo:** A interface se adapta perfeitamente a qualquer tamanho de tela.

### Painel de Administrador (`/admin`)
- **Autenticação Segura:** Sistema de login robusto utilizando Tokens JWT, enviados via cabeçalho `Authorization`.
- **Dashboard de Gerenciamento:** Visão centralizada de todos os imóveis cadastrados.
- **CRUD Completo de Imóveis:** Funcionalidades para Criar, Ler, Atualizar e Deletar imóveis.
- **Gerenciamento de Galeria de Imagens:** Upload de múltiplas imagens para a nuvem e exclusão de fotos individuais.

## 💡 Desafios e Aprendizados

Este projeto foi uma jornada de aprendizado imensa. Alguns dos principais desafios e conhecimentos adquiridos foram:

- **Arquitetura Full-Stack:** Conectar um frontend desacoplado (Next.js) a um backend (Node.js/Express), gerenciando a comunicação via API REST.
- **Autenticação e Segurança:** Implementar um sistema de login seguro do zero com JSON Web Tokens e middlewares de proteção de rota.
- **Gerenciamento de Banco de Dados:** Modelar o esquema de dados e realizar operações complexas de forma segura com o ORM Prisma.
- **Integração com Serviços Externos:** Lidar com uploads de arquivos para um serviço de nuvem como o Cloudinary.
- **Deploy Completo (CI/CD):** A experiência prática de publicar e conectar todos os componentes da aplicação (frontend, backend, banco de dados) em plataformas como Vercel e Render.
- **Resolução de Problemas Reais:** Depurar desafios complexos de um ambiente de produção, como erros de CORS e políticas de cookies cross-domain, garantindo que a aplicação funcione de forma estável e segura online.

## 🛠️ Stack de Tecnologias

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Banco de Dados:** PostgreSQL com Prisma (ORM)
- **Autenticação:** JWT (JSON Web Tokens)
- **Infraestrutura e Deploy:** Vercel (Frontend), Render.com (Backend & DB), Cloudinary (Imagens), Git & GitHub

## ⚙️ Como Executar o Projeto Localmente

```bash
# 1. Clone o repositório
git clone [https://github.com/lucasdlno/portfolio-site-imobiliaria.git](https://github.com/lucasdlno/portfolio-site-imobiliaria.git)
cd portfolio-site-imobiliaria

# 2. Configure o Backend
cd backend
npm install
cp .env.example .env 
# (Preencha o .env com suas chaves)
npx prisma migrate dev
npx prisma db seed
npm start

# 3. Configure o Frontend (em um novo terminal)
cd ../frontend
npm install
npm run dev

👨‍💻 Contato

LinkedIn: linkedin.com/in/lucasgomes1213
Email: lucasgomesdlno227@gmail.com
GitHub: @lucasdlno
Telefone/WhatsApp: +55 (15) 99805-1591