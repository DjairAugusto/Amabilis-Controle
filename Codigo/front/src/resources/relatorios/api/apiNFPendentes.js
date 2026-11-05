import api from '../../../services/api';

export const getNFsPendentes = async (obraId, params = {}) => {
  try {
    const response = await api.get(`/nota-fiscal/obra/${obraId}/pendentes`, { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar NFs pendentes:', error);
    throw error;
  }
};
