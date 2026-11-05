import api from "../../../services/api";

export const getTarefas = async () =>  {
    const response = await api.get('tarefa');
    return response.data;
}

export const getTarefasAll = async () => {
    const response = await api.get('tarefa/hierarquia')
    return response.data;
}

export const createTarefas = async(tarefaData) => {
    const response = await api.post('tarefa', tarefaData);
    return response.data;
}

export const updateTarefa = async(id, tarefaData) => {
    const response = await api.put(`tarefa/${id}`, tarefaData);
    return response.data;
}

export const deleteTarefa = async(id) => {
    const response = await api.delete(`tarefa/${id}`);
    return response.data;
}