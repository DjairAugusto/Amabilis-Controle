export const applyMask = (value, maskType) => {
    if (value === undefined || value === null) return '';

    if (maskType === 'currency') {
        let v = value.replace(/\D/g, ''); 
        if (v === '') return '';
        v = (Number(v) / 100).toFixed(2).replace('.', ',');
        v = v.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        return `R$ ${v}`;
    }

    if (maskType === 'cep') {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2') 
            .replace(/(-\d{3})\d+?$/, '$1'); 
    }

    if (maskType === 'cnpj') {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1.$2') 
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2') 
            .replace(/(\d{4})(\d)/, '$1-$2') 
            .replace(/(-\d{2})\d+?$/, '$1'); 
    }

    if (maskType === 'cpf') {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    }

    return value; 
};