export const gerarArrayParcelas = (valor, diaCobranca, numeroParcelas) => {
    const parcelas = [];
    const hoje = new Date();
    
    let mesAlvo = hoje.getMonth();
    let anoAlvo = hoje.getFullYear();
    const diaAtual = hoje.getDate();

    if (diaCobranca < diaAtual) {
        mesAlvo++;
    }

    for (let i = 0; i < numeroParcelas; i++) {
        
        const ultimoDiaDoMes = new Date(anoAlvo, mesAlvo + i + 1, 0).getDate();
        
        const diaValido = Math.min(diaCobranca, ultimoDiaDoMes);

        const dataParcela = new Date(anoAlvo, mesAlvo + i, diaValido);

        const anoStr = dataParcela.getFullYear();
        const mesStr = String(dataParcela.getMonth() + 1).padStart(2, '0');
        const diaStr = String(dataParcela.getDate()).padStart(2, '0');
        
        parcelas.push({
            valorPago: valor,
            dataPagamento: `${anoStr}-${mesStr}-${diaStr}`
        });
    }

    return parcelas;
};