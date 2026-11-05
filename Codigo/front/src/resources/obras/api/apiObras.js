import api from "../../../services/api";

export const getObrasCards = async (params = {}) => {
    const response = await api.get('obra/cards', { params });
    return response.data;
}

export const getObra = async (id) => {
    const response = await api.get(`obra/${id}`);
    return response.data;
}

export const createObras = async (obraData) => {
    const response = await api.post('obra', obraData);
    return response.data;
}

export const updateObra = async (id, obraData) => {
    const response = await api.put(`obra/${id}`, obraData);
    return response.data;
}

export const deleteObra = async (id) => {
    const response = await api.delete(`obra/${id}`);
    return response.data;
}

export const getObrasTodas = async () => {
    const response = await api.get('obra');
    return response.data;
}