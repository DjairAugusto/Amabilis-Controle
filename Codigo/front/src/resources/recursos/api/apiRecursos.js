import api from "../../../services/api";

export const getRecursosHierarquia = async () => {
    const response = await api.get('recurso/hierarquia');
    return response.data;
};

export const getRecursos = async () => {
    const response = await api.get('recurso');
    return response.data;
};

export const createRecurso = async (recursoData) => {
    const response = await api.post('recurso', recursoData);
    return response.data;
};

export const updateRecurso = async (id, recursoData) => {
    const response = await api.put(`recurso/${id}`, recursoData);
    return response.data;
};

export const deleteRecurso = async (id) => {
    const response = await api.delete(`recurso/${id}`);
    return response.data;
};

export const getGruposRecurso = async () => {
    const response = await api.get('grupo-recurso');
    return response.data;
};

export const createGrupoRecurso = async (grupoData) => {
    const response = await api.post('grupo-recurso', grupoData);
    return response.data;
};

export const updateGrupoRecurso = async (id, grupoData) => {
    const response = await api.put(`grupo-recurso/${id}`, grupoData);
    return response.data;
};

export const deleteGrupoRecurso = async (id) => {
    const response = await api.delete(`grupo-recurso/${id}`);
    return response.data;
};