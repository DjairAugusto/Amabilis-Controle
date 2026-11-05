import api from "../../../services/api";

export const getNfCards = async (params = {}) => {
    const response = await api.get('nota-fiscal/pagamentos', { params });
    return response.data;
}

export const lancarPagamento = async ({ id, data }) => {
    const response = await api.post(`nota-fiscal/${id}/pagamentos`, data)
    return response.data;
}

export const alterarStatus = async ({id, data}) => {
    const response = await api.put(`nota-fiscal/${id}/status`, data)
    return response.data;
}

export const deletePagamentoNf = async (id) => {
    const response = await api.delete(`nota-fiscal/pagamentos/${id}`);
    return response.data;
}
export const lancarPagamentoParcelado = async ({ id, data }) => {
    const response = await api.post(`nota-fiscal/${id}/pagamentos/agendar`, data)
    return response.data;
}