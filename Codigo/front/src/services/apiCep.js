import axios from "axios";

export const fetchCep = async (cep) => {
    const cepSeguro = String(cep || '');
    const cepLimpo = cepSeguro.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) return null;

    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        
        if (response.data.erro) {
            throw new Error("CEP não encontrado");
        }
        
        return response.data;
    } catch (error) {
        console.error("Erro na busca de CEP:", error);
        throw error; 
    }
};