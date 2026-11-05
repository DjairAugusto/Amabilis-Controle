# Integração API - Notas Fiscais

## Resumo da Integração

O Frontend foi integrado com os endpoints REST da API de Notas Fiscais do Backend. Os serviços estão configurados para usar MOCK por padrão, mas podem ser facilmente ativados apontando para o backend real.

## Estrutura de Arquivos

### Serviços API
- **`src/services/notasFiscaisAPI.js`** - Serviço completo de Notas Fiscais
- **`src/services/tarefasAPI.js`** - Serviço de Tarefas

## Endpoints Implementados

### 1. **POST /nota-fiscal/obra/{obraId}**
Criar nova nota fiscal
```javascript
await criarNotaFiscal(obraId, notaFiscal);
```
**Localização:** Modal "Lançar Nota Fiscal"
**Arquivo:** `LancarNotaFiscalModal.jsx`

### 2. **PUT /nota-fiscal/{notaFiscalId}**
Atualizar nota fiscal existente
```javascript
await atualizarNotaFiscal(notaFiscalId, dados);
```
**Localização:** Modal "Atualizar Nota Fiscal"
**Arquivo:** `EditarNotaFiscalModal.jsx`

### 3. **GET /nota-fiscal/obra/{obraId}**
Listar todas as notas fiscais de uma obra
```javascript
await buscarNotasFiscaisPorObra(obraId);
```

### 4. **GET /nota-fiscal/{notaFiscalId}**
Buscar nota fiscal com todos os itens
```javascript
await buscarNotaFiscalPorId(notaFiscalId);
```

### 5. **GET /nota-fiscal/{notaFiscalId}/itens**
Listar apenas os itens de uma nota fiscal
```javascript
await buscarItensPorNotaFiscal(notaFiscalId);
```

### 6. **DELETE /nota-fiscal/{notaFiscalId}**
Deletar nota fiscal
```javascript
await deletarNotaFiscal(notaFiscalId);
```

### 7. **POST /nota-fiscal/{notaFiscalId}/atribuir-itens**
Atrelar recursos a tarefas
```javascript
await atrelarRecursosATarefas(notaFiscalId, atrelamentos);
```
**Localização:** Modal "Atrelar Recursos às Tarefas"
**Arquivo:** `AtrelarRecursosModal.jsx`

### 8. **GET /nota-fiscal/{notaFiscalId}/pagamentos**
Listar pagamentos de uma nota fiscal
```javascript
await buscarPagamentosPorNotaFiscal(notaFiscalId);
```

## Mapeamento de Dados

O sistema converte automaticamente entre o formato do Frontend e o Backend:

### Frontend → Backend
```javascript
{
  numeroNF → numeroDocumento
  emissao → dataEmissao
  vencimento → dataVencimento
  valorTotal → valorTotal
  fornecedor.id → fornecedorId
  recursos[] → itens[] {
    id → recursoId
    subtotal → valorItem
  }
}
```

### Backend → Frontend
```javascript
{
  numeroDocumento → numeroNF
  dataEmissao → emissao
  dataVencimento → vencimento
  valorTotal → valorTotal
  fornecedorId → fornecedor.id
  itens[] → recursos[] {
    recursoId → id
    valorItem → subtotal
  }
}
```

## Como Ativar Backend

### 1. No arquivo `src/services/notasFiscaisAPI.js`

Alterar:
```javascript
const USE_MOCK = false;  // Mudar de true para false
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
```

### 2. Variáveis de Ambiente

Adicionar no arquivo `.env`:
```
REACT_APP_API_URL=http://seu-backend.com/api
```

Ou usar o padrão (localhost:8080/api) se não configurado.

## Estrutura de Requisições

### Criar Nota Fiscal
```json
POST /nota-fiscal/obra/{obraId}
{
  "numeroDocumento": "001234",
  "dataEmissao": "2026-04-21",
  "dataVencimento": "2026-05-21",
  "valorTotal": 5500.00,
  "fornecedorId": 1,
  "itens": [
    {
      "valorItem": 4550.00,
      "recursoId": 1
    }
  ]
}
```

### Atualizar Nota Fiscal
```json
PUT /nota-fiscal/{notaFiscalId}
{
  "numeroDocumento": "001234",
  "dataEmissao": "2026-04-21",
  "dataVencimento": "2026-05-21",
  "valorTotal": 5500.00,
  "fornecedorId": 1,
  "itens": [
    {
      "id": 1,
      "valorItem": 4550.00,
      "recursoId": 1
    }
  ]
}
```

### Atrelar Recursos a Tarefas
```json
POST /nota-fiscal/{notaFiscalId}/atribuir-itens
[
  {
    "itemNotaFiscalId": 1,
    "tarefaId": 50
  },
  {
    "itemNotaFiscalId": 2,
    "tarefaId": 50
  }
]
```

## Modais Relacionados

1. **LancarNotaFiscalModal.jsx**
   - Chama: `criarNotaFiscal(obraId, notaFiscal)`

2. **EditarNotaFiscalModal.jsx**
   - Chama: `atualizarNotaFiscal(notaFiscalId, notaFiscal)`

3. **AtrelarRecursosModal.jsx**
   - Chama: `atrelarRecursosATarefas(notaFiscalId, atrelamentos)`

## Tratamento de Erros

Todos os serviços incluem tratamento de erro com messages descritivas:

```javascript
try {
  await criarNotaFiscal(obraId, notaFiscal);
} catch (error) {
  console.error('Erro ao criar nota fiscal:', error);
  alert('Erro ao lançar nota fiscal: ' + error.message);
}
```

## Próximos Passos

1. ✅ Frontend integrado com Mock
2. ⏳ Ativar Backend (trocar `USE_MOCK = false`)
3. ⏳ Integrar com API de Recursos
4. ⏳ Integrar com API de Fornecedores
5. ⏳ Integrar com API de Pagamentos

## Debug

Para ver as requisições sendo feitas:
1. Abra DevTools (F12)
2. Vá para a aba "Network"
3. Realize as operações (criar, editar, atrelar)
4. Verifique as requisições e respostas
