import api from "../../../services/api";

export const getResumoDashboard = async () => {
    const response = await api.get('dashboard/resumo');
    return response.data;
}

export const getEvolucaoMensal = async (dataInicio, dataFim) => {
    const response = await api.get('dashboard/evolucao-mensal', {
        params: {
            dataInicio,
            dataFim
        }
    });
    return response.data;
}

export const getGraficoFornecedores = async () => {
    const response = await api.get('dashboard/fornecedores');
    return response.data;
}

export const getGraficoRecursos = async () => {
    const response = await api.get('dashboard/recursos');
    return response.data;
}

export const getEstatisticasObra = async (id) => {
    const response = await api.get(`dashboard/obra/${id}`);
    return response.data;
}