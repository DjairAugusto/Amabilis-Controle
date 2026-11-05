import api from "../../../services/api";

export const atribuirTarefas = async (obraId, data) => {
    const response = await api.post(`obra/${obraId}/atribuir-tarefas`, data);
    return response.data;
}

export const atualizarStatusItemObra = async (itemId, statusData) => {
    const response = await api.put(`obra/itens/${itemId}/atualizar-status`, statusData);
    return response.data;
}