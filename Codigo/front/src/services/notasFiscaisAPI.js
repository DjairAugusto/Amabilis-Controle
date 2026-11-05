/**
 * API de Notas Fiscais
 * 
 * Serviço para gerenciar chamadas à API de notas fiscais do backend.
 * Documentação dos endpoints disponível nos comentários abaixo.
 */

import { obra1Mock } from '../mock/obra1Mock';

// Flag para usar mock (alterar para false quando backend estiver pronto)
const USE_MOCK = false;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Mapeia dados do frontend para o formato esperado pelo backend
 */
const mapearNotaFiscalParaAPI = (notaFiscal) => {
  return {
    numeroDocumento: notaFiscal.numeroNF,
    dataEmissao: notaFiscal.emissao,
    dataVencimento: notaFiscal.vencimento,
    valorTotal: notaFiscal.valorTotal,
    fornecedorId: notaFiscal.fornecedor?.id || 1, // ID padrão se não houver
    itens: (notaFiscal.recursos || []).map(recurso => ({
      valorItem: recurso.subtotal || 0,
      recursoId: recurso.id,
    })),
  };
};

/**
 * Mapeia resposta da API para o formato do frontend
 */
const mapearNotaFiscalDoAPI = (nota) => {
  return {
    id: nota.id,
    numeroNF: nota.numeroDocumento,
    fornecedor: {
      id: nota.fornecedorId,
      nome: nota.fornecedorNome || 'Fornecedor',
      cnpj: nota.fornecedorCNPJ || '',
    },
    emissao: nota.dataEmissao,
    vencimento: nota.dataVencimento,
    valorTotal: nota.valorTotal,
    status: nota.statusNotaFiscal || nota.status || 'PENDENTE',
    recursos: (nota.itens || []).map(item => ({
      id: item.id,
      recursoId: item.recursoId,
      descricao: item.recursoDescricao || '',
      tipo: item.recursoTipo || 'MA',
      quantidade: item.quantidade || 1,
      valorUnitario: item.valorItem || 0,
      subtotal: item.valorItem || 0,
      tarefaId: item.tarefaId,
    })),
  };
};

/**
 * Buscar todas as notas fiscais de uma obra
 * GET /nota-fiscal/obra/{obraId}
 * @param {number} obraId - ID da obra
 * @returns {Promise<Array>} Lista de notas fiscais
 */
export const buscarNotasFiscaisPorObra = async (obraId) => {
  try {
    if (USE_MOCK) {
      return obra1Mock.notasFiscais || [];
    }

    const response = await fetch(`${API_BASE_URL}/nota-fiscal/obra/${obraId}`);
    if (!response.ok) throw new Error('Erro ao buscar notas fiscais');
    const data = await response.json();
    return Array.isArray(data) ? data.map(mapearNotaFiscalDoAPI) : [];
  } catch (error) {
    console.error('Erro ao buscar notas fiscais:', error);
    throw error;
  }
};

/**
 * Buscar uma nota fiscal específica com itens
 * GET /nota-fiscal/{notaFiscalId}
 * @param {number} notaFiscalId - ID da nota fiscal
 * @returns {Promise<Object>} Dados da nota fiscal
 */
export const buscarNotaFiscalPorId = async (notaFiscalId) => {
  try {
    if (USE_MOCK) {
      return obra1Mock.notasFiscais?.find(nf => nf.id === notaFiscalId);
    }

    const response = await fetch(`${API_BASE_URL}/nota-fiscal/${notaFiscalId}`);
    if (!response.ok) throw new Error('Erro ao buscar nota fiscal');
    const data = await response.json();
    return mapearNotaFiscalDoAPI(data);
  } catch (error) {
    console.error('Erro ao buscar nota fiscal:', error);
    throw error;
  }
};

/**
 * Buscar itens de uma nota fiscal
 * GET /nota-fiscal/{notaFiscalId}/itens
 * @param {number} notaFiscalId - ID da nota fiscal
 * @returns {Promise<Array>} Lista de itens
 */
export const buscarItensPorNotaFiscal = async (notaFiscalId) => {
  try {
    if (USE_MOCK) {
      const nf = obra1Mock.notasFiscais?.find(n => n.id === notaFiscalId);
      return nf?.recursos || [];
    }

    const response = await fetch(`${API_BASE_URL}/nota-fiscal/${notaFiscalId}/itens`);
    if (!response.ok) throw new Error('Erro ao buscar itens');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar itens:', error);
    throw error;
  }
};

/**
 * Criar nova nota fiscal
 * POST /nota-fiscal/obra/{obraId}
 * @param {number} obraId - ID da obra
 * @param {Object} notaFiscal - Dados da nota fiscal
 * @returns {Promise<Object>} Nota fiscal criada
 */
export const criarNotaFiscal = async (obraId, notaFiscal) => {
  try {
    if (USE_MOCK) {
      const novaNotaFiscal = {
        id: Math.random(),
        ...notaFiscal,
        createdAt: new Date().toISOString(),
      };
      return novaNotaFiscal;
    }

    const payload = mapearNotaFiscalParaAPI(notaFiscal);
    
    const response = await fetch(`${API_BASE_URL}/nota-fiscal/obra/${obraId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao criar nota fiscal');
    }

    const data = await response.json();
    return mapearNotaFiscalDoAPI(data);
  } catch (error) {
    console.error('Erro ao criar nota fiscal:', error);
    throw error;
  }
};

/**
 * Atualizar nota fiscal
 * PUT /nota-fiscal/{notaFiscalId}
 * @param {number} notaFiscalId - ID da nota fiscal
 * @param {Object} dados - Dados a atualizar
 * @returns {Promise<Object>} Nota fiscal atualizada
 */
export const atualizarNotaFiscal = async (notaFiscalId, dados) => {
  try {
    if (USE_MOCK) {
      return { id: notaFiscalId, ...dados };
    }

    const payload = mapearNotaFiscalParaAPI(dados);

    const response = await fetch(`${API_BASE_URL}/nota-fiscal/${notaFiscalId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atualizar nota fiscal');
    }

    const data = await response.json();
    return mapearNotaFiscalDoAPI(data);
  } catch (error) {
    console.error('Erro ao atualizar nota fiscal:', error);
    throw error;
  }
};

/**
 * Deletar nota fiscal
 * DELETE /nota-fiscal/{notaFiscalId}
 * @param {number} notaFiscalId - ID da nota fiscal
 * @returns {Promise<Boolean>} Sucesso da operação
 */
export const deletarNotaFiscal = async (notaFiscalId) => {
  try {
    if (USE_MOCK) {
      return true;
    }

    const response = await fetch(`${API_BASE_URL}/nota-fiscal/${notaFiscalId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao deletar nota fiscal');
    }

    return true;
  } catch (error) {
    console.error('Erro ao deletar nota fiscal:', error);
    throw error;
  }
};

/**
 * Atrelar recursos de uma nota fiscal a tarefas
 * POST /nota-fiscal/{notaFiscalId}/atribuir-itens
 * @param {number} notaFiscalId - ID da nota fiscal
 * @param {Array} atrelamentos - Array de {itemNotaFiscalId, tarefaId}
 * @returns {Promise<Object>} Resultado do atrelamento
 */
export const atrelarRecursosATarefas = async (notaFiscalId, atrelamentos) => {
  try {
    if (USE_MOCK) {
      return {
        notaFiscalId,
        atrelamentos,
        atrelamentosTotal: atrelamentos.length,
        sucesso: true,
      };
    }

    const payload = atrelamentos.map(item => ({
      itemNotaFiscalId: item.itemNotaFiscalId || item.id,
      tarefaId: parseInt(item.tarefaSelecionada || item.tarefaId),
    }));

    const response = await fetch(`${API_BASE_URL}/nota-fiscal/${notaFiscalId}/atribuir-itens`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao atrelar recursos');
    }

    const data = await response.json();
    return {
      sucesso: true,
      data,
    };
  } catch (error) {
    console.error('Erro ao atrelar recursos:', error);
    throw error;
  }
};

/**
 * Buscar pagamentos de uma nota fiscal
 * GET /nota-fiscal/{notaFiscalId}/pagamentos
 * @param {number} notaFiscalId - ID da nota fiscal
 * @returns {Promise<Array>} Lista de pagamentos
 */
export const buscarPagamentosPorNotaFiscal = async (notaFiscalId) => {
  try {
    if (USE_MOCK) {
      return [];
    }

    const response = await fetch(`${API_BASE_URL}/nota-fiscal/${notaFiscalId}/pagamentos`);
    if (!response.ok) throw new Error('Erro ao buscar pagamentos');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    throw error;
  }
};

export default {
  buscarNotasFiscaisPorObra,
  buscarNotaFiscalPorId,
  buscarItensPorNotaFiscal,
  criarNotaFiscal,
  atualizarNotaFiscal,
  deletarNotaFiscal,
  atrelarRecursosATarefas,
  buscarPagamentosPorNotaFiscal,
};
