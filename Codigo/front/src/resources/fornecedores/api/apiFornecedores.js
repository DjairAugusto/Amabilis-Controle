import api from "../../../services/api";

export const getFornecedores = async () => {
    const response = await api.get('fornecedor');
    const dados = response?.data?.data || response?.data || [];

    return dados.map(f => ({
        id: f.id,
        codigoFornecedor: f.codigoFornecedor,
        razaoSocial: f.razaoSocial,
        nomeFantasia: f.nomeFantasia,
        documento: f.documento, 
        tipoDocumento: f.tipoDocumento,
        statusFornecedor: f.statusFornecedor,
        endereco: f.endereco ? {
            logradouro: f.endereco.logradouro || "",
            numeroEndereco: f.endereco.numeroEndereco || "",
            cep: f.endereco.cep || "",
            bairro: f.endereco.bairro || "",
            cidade: f.endereco.cidade || "",
            estado: f.endereco.estado || ""
        } : null
    }));
}

export const createFornecedor = async(fornecedorData) => {
    const response = await api.post('fornecedor', fornecedorData);
    return response.data;
}

export const updateFornecedor = async(id, fornecedorData) => {
    const response = await api.put(`fornecedor/${id}`, fornecedorData);
    return response.data;
}

export const deleteFornecedor = async(id) => {
    const response = await api.delete(`fornecedor/${id}`);
    return response.data;
}