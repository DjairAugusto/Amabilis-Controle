# Amabilis Controle

Sistema integrado para gerenciamento e controle de obras, atividades, recursos e fornecedores. Desenvolvido para otimizar processos administrativos e operacionais em projetos de construção e atividades correlatas.

**[Backlog do Projeto - Jira](https://amabilisengenharia.atlassian.net/jira/software/projects/SCRUM/boards/1/backlog)**

---

## Contexto

A gestão de obras na construção civil frequentemente sofre com a desorganização: perda de notas fiscais, dificuldade no rastreio de materiais e orçamentos que saem do controle. O Amabilis Controle foi desenvolvido para resolver exatamente essa dor.

Ele atua como um centro de comando integrado, substituindo planilhas descentralizadas por uma plataforma unificada que dá ao gestor controle total sobre as operações do canteiro de obras.

Principais Funcionalidades:

- **Gestão Financeira:** Controle de pagamentos, notas fiscais e relatórios de custos atrelados a tarefas específicas.

- **Mapeamento Inteligente:** Visualização geográfica das obras em andamento para melhor gestão logística.

- **Controle de Recursos:** Rastreabilidade ponta a ponta de fornecedores, materiais e alocação de mão de obra.

O sistema permite tomada de decisão mais eficiente através de relatórios e dashboards integrados, facilitando o acompanhamento de custos, prazos e recursos.

---

## Acesso ao Sistema

Credenciais de acesso para testes:
usuario: admin@amabilis.com
senha: amabilis123

O sistema pode ser acessado online por meio de [Amabilis Controle](https://amabilis-front.onrender.com), ou localmente seguindo a documentação do projeto: [Acesso ao Sistema Localmente](#acesso-ao-sistema-localmente)

---

## Documentação

### Recursos de Documentação
- **API Swagger**: http://localhost:8080/swagger-ui.html
- **Casos de Uso**: [Documentação do Projeto/CasosDeUso](Artefatos/Documentação%20do%20Projeto/CasosDeUso/)
- **Wireframes**: [Documentação do Projeto/Wireframes](Artefatos/Documentação%20do%20Projeto/Wireframes/)
- **Atas de Reunião**: [Artefatos/Atas](Artefatos/Atas/)

---

## Arquitetura do Projeto

O projeto segue uma arquitetura **cliente-servidor** com separação clara de responsabilidades:

```
┌─────────────────────┐
│   Frontend (React)  │  ← Vite + React Router + TanStack Query
│  (Código/front)     │
└──────────┬──────────┘
           │ HTTP/REST
           ↓
┌─────────────────────┐
│ Backend (Java)      │  ← Spring Boot + Spring Data JPA + PostgreSQL
│ (Código/back)       │
└─────────────────────┘
           ↓
┌─────────────────────┐
│   PostgreSQL DB     │
└─────────────────────┘
```

---

## Tecnologias

### Backend
| Tecnologia | Versão | Descrição |
|---|---|---|
| **Java** | 21 | Linguagem de programação |
| **Spring Boot** | 4.0.4 | Framework web e IoC |
| **PostgreSQL** | 17 | Banco de dados relacional |
| **Spring Security** | - | Autenticação e proteção de rotas |

> **Bibliotecas Adicionais:** Spring Data JPA, SpringDoc OpenAPI (Swagger), Lombok, Spring Validation, Apache POI (Exportação Excel).

### Frontend
| Tecnologia | Versão | Descrição |
|---|---|---|
| **React** | 19.2.4 | Biblioteca UI |
| **Vite** | 8.0.1 | Bundler e dev server |
| **React Router DOM** | 7.13.2 | Roteamento de páginas |
| **TanStack Query** | 5.96.2 | Gerenciamento de estado e cache de dados |
| **Gradio Client** | 2.2.0 | Integração com modelos de Inteligência Artificial |

> **Bibliotecas Adicionais:** Axios (Cliente HTTP), Recharts (Gráficos), Lucide React (Ícones), ESLint.

### Inteligência Artificial (RAG)
O sistema utiliza arquitetura de **Retrieval-Augmented Generation (RAG)** para oferecer suporte técnico e financeiro sobre as obras em tempo real.

* **Modelo:** Meta Llama 3.3 70B
* **Provedor:** Groq (Inferência de alta performance)
* **Arquitetura:** Contexto dinâmico injetado via *System Prompt* com filtragem inteligente de dados

---

### Padrões Arquiteturais Utilizados:
- **API RESTful**: Comunicação padronizada utilizando métodos HTTP e respostas em JSON.
- **Arquitetura em Camadas**: Separação clara de responsabilidades no Back-end (`Controllers` → `Services` → `Repositories` → `Database`).
- **DTO Pattern (Data Transfer Object)**: Ocultação de dados sensíveis da entidade e transferência segura de informações entre as camadas.
- **Repository Pattern**: Abstração da lógica de acesso ao banco de dados.
- **Component-Based**: Construção da interface do Front-end (React) utilizando componentes modulares e reutilizáveis.

---

## Estrutura do Repositório

<details>
<summary><b>Clique para expandir a organização de pastas do projeto</b></summary>

```text
amabilis-controle/
├── Codigo/
│   ├── back/                          # Backend Spring Boot (Java)
│   │   └── src/main/java/amabilis/controle/
│   │       ├── config/                # Configurações globais e Data Initializers
│   │       ├── controller/            # REST Controllers (Endpoints da API)
│   │       ├── domain/                # Entidades mapeadas do banco de dados (JPA)
│   │       ├── dto/                   # Data Transfer Objects
│   │       ├── repository/            # Camada de abstração com o banco (Spring Data)
│   │       └── service/               # Regras de negócio da aplicação
│   │
│   └── front/                         # Frontend SPA (React + Vite)
│       └── src/
│           ├── components/            # Componentes visuais modulares e reutilizáveis
│           ├── data/                  # Constantes e dados estáticos
│           ├── hooks/                 # React Hooks customizados
│           ├── layouts/               # Estruturas de layout de página
│           ├── mock/                  # Dados simulados para testes de interface
│           ├── pages/                 # Telas principais do sistema
│           ├── services/              # Integração com APIs externas e Backend
│           └── utils/                 # Funções utilitárias e formatadores de dados
│
├── Artefatos/                         # Documentação técnica e de engenharia
│   ├── Atas/                          # Registros das reuniões de alinhamento do grupo
│   ├── Banco de dados/                # Modelagem do banco e Diagrama de Classes de Domínio
│   └── Documentação do Projeto/       # Requisitos, Casos de Uso e Wireframes
│
└── Divulgacao/                        # Material de apresentação e Pitch do software
```
</details>

---

## Acesso ao Sistema Localmente

### Pré-requisitos

Escolha **uma** das abordagens abaixo para rodar o projeto:

**Opção 1: Via Docker (Recomendado)**
* **Git**
* **Docker** e **Docker Compose**

**Opção 2: Execução Local Nativa**
* **Git**
* **Java 21** (JDK)
* **Maven 3.8+**
* **Node.js 18+**
* **PostgreSQL 12+**

---

### Como Instalar e Executar

#### 1. Clonando o Repositório

```bash
git clone https://github.com/ICEI-PUC-Minas-PMGES-TI/pmg-es-2026-1-ti3-9577100-amabilis-controle.git
cd amabilis-controle
```

#### 2. Configurar o Backend

##### 2.1. Configurar Banco de Dados

Criar ou se conectar a um banco de dados existente

##### 2.2. Configurar Variáveis de Ambiente

**Com docker:**
- Copiar o arquivo .env.example e renomear para .env
- Adicionar as variáveis de ambiente solicitadas

**Sem docker:**
- Editar o arquivo Codigo/back/src/main/resources/application.properties, adicionando as credenciais do banco de dados

##### 2.3. Instalar Dependências e Executar

**Com docker:**

```bash
cd Codigo/back
docker compose up --build -d
```

**Sem docker:**

```bash
cd Codigo/back

# Com Maven
./mvnw clean install
./mvnw spring-boot:run

# Ou com IDE (executar ControleApplication.java)
```

O backend estará disponível em: **http://localhost:8080**

---

#### 3. Configurar o Frontend

##### 3.1. Variáveis de Ambiente

- Copiar o arquivo .env.example e renomear para .env
- Adicionar as variáveis de ambiente solicitadas

##### 3.2. Executar em Desenvolvimento

**Com docker:**

```bash
cd Codigo/front
docker compose up --build -d
```

**Sem docker:**

```bash
cd Codigo/front
npm install
npm run dev
```

---

## Documentação da API (Swagger)

Todos os endpoints, métodos HTTP, payloads de requisição e respostas esperadas estão documentados de forma interativa através do **SpringDoc OpenAPI (Swagger)**.

Você pode explorar a documentação completa e testar as rotas da API diretamente pelos links abaixo:

* **Ambiente de Produção (Nuvem):** [Acessar Swagger UI](https://amabilis-api-tk8q.onrender.com/swagger-ui.html)
* **Ambiente Local:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) *(Requer o backend rodando)*

## Segurança

A proteção dos dados e a integridade do sistema foram priorizadas utilizando as seguintes abordagens no Back-end:

* **Spring Security:** Gerenciamento centralizado de autenticação e controle de acesso às rotas da API.
* **Criptografia de Senhas:** Hashes de credenciais gerados e armazenados de forma irreversível utilizando o algoritmo padrão da indústria (**BCrypt**).
* **Validação de Entrada:** Uso de DTOs anotados com `@Valid`, `@NotBlank` e `@NotNull` para garantir que dados maliciosos ou incompletos sejam bloqueados antes de atingirem a regra de negócio.
* **CORS (Cross-Origin Resource Sharing):** Políticas de acesso configuráveis por ambiente, garantindo que apenas o Front-end oficial (React) tenha permissão para consumir a API.

---

## Equipe

### Alunos Integrantes
- Daniel Bony Costa Garcia - [GitHub](https://github.com/danielbcg)
- Djair Augusto Galdino Soares - [GitHub](https://github.com/DjairAugusto)
- Fillipe Gabriel Costa Araujo - [GitHub](https://github.com/FillipeG)
- João Prado Campos - [GitHub](https://github.com/Joao-Prado0)
- Lorena Aparecida de Paula Pereira - [GitHub](https://github.com/einfolke)
- Lucas Gabriel de Oliveira Franco - [GitHub](https://github.com/lucasfrgabriel)

### Professores Responsáveis
- Luiz Carlos da Silva
- Michelle Hanne Soares de Andrade
- Nelson Ribeiro de Carvalho Junior

---

## Licença

Este projeto está licenciado sob [CC-BY-4.0](LICENSE)

---

**Última atualização**: Junho de 2026
