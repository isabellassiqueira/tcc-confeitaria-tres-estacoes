# 🍰 CONFEITARIA TRÊS ESTAÇÕES – E-commerce de Confeitaria

Um e-commerce completo para venda de bolos, doces, salgados e sobremesas artesanais.  
Interface moderna, integração com carrinho e painel administrativo.

---

## 📌 Conteúdo
- [Visão Geral](#-visao-geral)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Tecnologias Utilizadas](#-Tecnologias-Utilizadas)
- [Funcionalidades](#-Funcionalidades)
- [Instalação e Execução](#-Instalação-e-Execução)
- [Configuração do Banco de Dados](#-Configuração-do-Banco-de-Dados)
- [Estrutura de Pastas](#-Estrutura-de-Pastas)
- [Endpoints da API](#-Endpoints-da-API)
- [Screenshots](#-Screenshots)

---

## 🎥 Visão Geral
O sistema foi desenvolvido para informatizar processos de uma confeitaria real, permitindo:

- Vendas online
- Controle de produtos
- Cadastro e autenticação de usuários
- Gestão de pedidos
- Painel administrativo
- Interface moderna e responsiva

O foco principal é oferecer uma solução completa, escalável e profissional para pequenas confeitarias.

---

## 🏗 Arquitetura do Sistema

O projeto segue o formato Full Stack:

- Frontend — React + Vite

- Páginas públicas e privadas

- Carrinho de compras

- Área do cliente

- Área administrativa

- Comunicação via API REST

Backend — Node.js + Express

- Autenticação JWT

- CRUD completo (produtos, usuários, pedidos)

- Middleware de segurança

- Integração com MySQL

- Organização modular

Banco — MySQL

- Tabelas relacionais

- Chaves estrangeiras

- Integridade referencial

---

## 🛠 Tecnologias
Frontend

- React.js

- Vite

- React Router

- CSS puro e componentes

- Fetch API

Backend

- Node.js

- Express

- MySQL2

- JWT

- Dotenv

Outros

- Git / GitHub

- Postman para testes

- MySQL Workbench
---

## ⭐ Funcionalidades
✔ Área do Cliente

Cadastro e login

Atualização de perfil

Visualização de pedidos

Carrinho persistente

✔ Loja

Listagem de produtos

Busca

Filtros

Página detalhada do produto

Adicionar à sacola

✔ Sistema de Pedidos

Registrar pedidos

Atualizar status

Listagem para o cliente

Listagem para administradores

✔ Administração

CRUD de produtos

CRUD de usuários

Gestão de pedidos

Controle de estoque

---

## 🚀 Instalação e Execução
1. Clonar o repositório
   
git clone https://github.com/isabellassiqueira/tcc-confeitaria-tres-estacoes.git

- 📦 Backend (Node.js)

cd Backend_Cliente

npm install

npm start

Crie o arquivo .env dentro de Backend_Cliente/:

DB_HOST=localhost

DB_USER=root

DB_PASSWORD=sua_senha

DB_NAME=confeitaria_system

JWT_SECRET=umsegurosegredo

PORT=8080

Execute:

npm start

- 🎨 Frontend (React + Vite)
cd Frontend
npm install
npm run dev

O frontend iniciará em:

http://localhost:5173

---

## 🗄 Configuração do Banco de Dados

Crie um banco no MySQL e rode essa configuração:

[configuração confeitaria_system;.txt](https://github.com/user-attachments/files/23783935/configuracao.confeitaria_system.txt)

Ajuste o arquivo db.js se necessário.

---
## 📁 Estrutura de Pastas

📦 TCC Confeitaria Três Estações

├── Backend_Cliente

│     ├── server.js

│     ├── db.js

│     ├── controllers/

│     ├── routes/

│     ├── middlewares/

│     └── models/

│

└── Frontend

│       ├── src/

│       ├── pages/

│       ├── componentes/

│       ├── context/

│       ├── services/

│       └── App.jsx

---

## 🔌 Endpoints da API

- Auth

POST, /auth/register, Cadastrar

POST	/auth/login	Fazer login

- Produtos

| GET | /produtos | Listar |

| GET | /produtos/:id | Ver |

| POST | /produtos | Criar |

| PUT | /produtos/:id | Editar |

| DELETE | /produtos/:id | Remover |

- Pedidos

| GET | /pedidos | Listar todos (admin) |

| GET | /pedidos/user/:id | Pedidos do cliente |

| POST | /pedidos | Criar pedido |

| PUT | /pedidos/:id | Atualizar status |

---

## 🖼 Screenshots
<img  width="700" src="https://github.com/user-attachments/assets/2c9a0f45-19e7-4838-a887-2c7e94291417" />
<img width="700"  src="https://github.com/user-attachments/assets/6f9d13b7-d348-46d7-8dd5-e6705f3361fc" />
<img width="700" src="https://github.com/user-attachments/assets/9555de2c-ca7c-435b-b034-fdb3aa9265d1" />
<img width="700" src="https://github.com/user-attachments/assets/61a65569-ffd4-4ee8-8570-667dc435cab7" />
<img width="700" src="https://github.com/user-attachments/assets/a5d4a0e1-2706-4d8b-84c0-67475baca532" />
<img width="700" src="https://github.com/user-attachments/assets/3ded6673-2368-4647-b389-39317e635d66" />
<img width="700" src="https://github.com/user-attachments/assets/0579110b-5f93-4afe-9271-db9bbefa81fe" />
<img width="700" src="https://github.com/user-attachments/assets/885c5b24-5a17-44ea-97b2-bb8833935882" />
<img width="700" src="https://github.com/user-attachments/assets/ce58bce2-6ccc-458f-8352-71e713a1aa16" />
<img width="700" src="https://github.com/user-attachments/assets/f727bfd3-b48a-41d9-93b0-e0cc27f2647b" />
<img width="700" src="https://github.com/user-attachments/assets/5e0a5aa5-8dc2-446c-988b-ca63985cb94b" />
<img width="700" src="https://github.com/user-attachments/assets/e6b43156-87f8-4ae3-8650-9d9b3c538a2c" />
<img width="700" src="https://github.com/user-attachments/assets/680678f6-a411-4cad-8513-ad740f3b1b8b" />

---

## 👩‍💻 Projeto desenvolvido por Isabella, Lavignya e Sayuri para conclusão do curso de Desenvolvimento de Sistemas da instituição SENAI - Osasco.
Linkedin:

https://www.linkedin.com/in/isabella-dos-santos-siqueira-877300382/

https://www.linkedin.com/in/lavignya-silva-santiago-0ba760383/

https://www.linkedin.com/in/sayuri-nakagawa-2bab59381/
