import api from "../../../services/api";

// Buscar todas as notas fiscais de uma obra específica (com filtros e paginação)
export const getNotasFiscaisPorObra = async (obraId, params = {}) => {
    const response = await api.get(`nota-fiscal/obra/${obraId}`, { params });
    return response.data;
}

// Buscar os detalhes de uma nota fiscal (incluindo os itens/recursos)
export const getNotaFiscal = async (id) => {
    const response = await api.get(`nota-fiscal/${id}`);
    return response.data;
}

// Criar uma nova nota fiscal atrelada a uma obra
export const criarNotaFiscal = async (obraId, data) => {
    const response = await api.post(`nota-fiscal/obra/${obraId}`, data);
    return response.data;
}

// Atualizar uma nota fiscal existente
export const atualizarNotaFiscal = async (id, data) => {
    const response = await api.put(`nota-fiscal/${id}`, data);
    return response.data;
}

// Deletar uma nota fiscal
export const deletarNotaFiscal = async (id) => {
    const response = await api.delete(`nota-fiscal/${id}`);
    return response.data;
}

// Atrelar recursos (itens da NF) às tarefas da obra
export const atrelarRecursosATarefas = async (notaFiscalId, loteAlocacoes) => {
    // O back-end espera um Array de AlocacaoItensRequestDTO
    const response = await api.post(`nota-fiscal/${notaFiscalId}/atribuir-itens`, loteAlocacoes);
    return response.data;
}

export const getItensNotaFiscal = async (notaFiscalId) => {
    const response = await api.get(`nota-fiscal/${notaFiscalId}/itens`);
    return response.data;
}