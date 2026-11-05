export const formatarEndereco = (endereco) => {
    if (!endereco) return "Endereço não informado";

    const { logradouro, numero, numeroEndereco, bairro, cidade, estado } = endereco;
    
    const num = numero || numeroEndereco || "S/N";
    
    if (!logradouro) return "Endereço incompleto";

    return `${logradouro}, ${num} - ${bairro}, ${cidade} - ${estado}`;
};

export const formatarMoeda = (valor) => {
    const numero = Number(valor) || 0; 

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true 
    }).format(numero);
};

export const formatarData = (dataBackend) => {
    if (!dataBackend) return '-';

    const dataApenas = dataBackend.split('T')[0]; 
    
    const partes = dataApenas.split('-'); 

    if (partes.length === 3) {
        return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return dataBackend;
};
export const formatarPorcentagem = (valor) => {
    const numero = Number(valor) || 0;

    const numeroFormatado = new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 0, 
        maximumFractionDigits: 2  
    }).format(numero);

    return `${numeroFormatado}%`;
};