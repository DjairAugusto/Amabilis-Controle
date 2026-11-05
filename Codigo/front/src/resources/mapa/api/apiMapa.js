import api from "../../../services/api";

export const getObrasParaMapa = async () => {
    const response = await api.get('obra/maps');
    return response.data;
}