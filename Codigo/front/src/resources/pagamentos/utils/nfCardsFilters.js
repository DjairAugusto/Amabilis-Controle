import { MAPA_STATUS_BACKEND } from './statusNotaFiscal';

export const pesquisarCardsNfs = (cards, { termo, obra, status, dataVenc }) => {
    // 1. Tratamento de segurança: Verifica se está vazio OU se é o texto do placeholder
    const isTermoVazio = !termo || termo.trim() === '';
    const isObraVazia = !obra || obra === 'Todas as Obras';
    const isStatusVazio = !status || status === 'Todos os Status';
    const isDataVazia = !dataVenc || dataVenc === 'Qualquer Data';

    // 🔴 2. A SUGESTÃO DE OURO: Se tudo estiver vazio, devolve os cards intocados na mesma hora!
    if (isTermoVazio && isObraVazia && isStatusVazio && isDataVazia) {
        return cards;
    }

    // 3. Aplica os filtros apenas nos campos que estão realmente preenchidos
    return cards.filter((card) => {
        
        // Teste da Pesquisa (Termo)
        const termoMin = termo?.toLowerCase() || '';
        const nfMatch = card.codigoNf?.toLowerCase().includes(termoMin);
        const fornecedorMatch = card.nomeFornecedor?.toLowerCase().includes(termoMin);
        const passouNoTermo = isTermoVazio || nfMatch || fornecedorMatch;

        // Teste da Obra
        const passouNaObra = isObraVazia || card.nomeObra === obra;

        // Teste do Status
        const statusEnumBackend = MAPA_STATUS_BACKEND[status]; 
        const passouNoStatus = isStatusVazio || card.statusNf === statusEnumBackend;

        // Teste data 
        let passouNaData = true;
        if (!isDataVazia && card.dataVencimento) {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar só o dia

            // Tratamento blindado para YYYY-MM-DD (Evita bugs de fuso horário do JS)
            const partesData = card.dataVencimento.split('T')[0].split('-');
            const vencimento = new Date(partesData[0], partesData[1] - 1, partesData[2]);
            vencimento.setHours(0, 0, 0, 0);

            // Calcula a diferença exata em dias
            const diffEmDias = Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24));

            // Filtra pegando >= 0 (para ignorar as que já venceram no passado) e o limite de dias
            if (dataVenc === 'Esta Semana') passouNaData = diffEmDias >= 0 && diffEmDias <= 7;
            else if (dataVenc === 'Próximos 15 dias') passouNaData = diffEmDias >= 0 && diffEmDias <= 15;
            else if (dataVenc === 'Próximo Mês') passouNaData = diffEmDias >= 0 && diffEmDias <= 30;
            else if (dataVenc === 'Próximos 3 Meses') passouNaData = diffEmDias >= 0 && diffEmDias <= 90;
            else if (dataVenc === 'Próximos 6 Meses') passouNaData = diffEmDias >= 0 && diffEmDias <= 180;
        }

        // Só retorna TRUE se passar nos testes que estão ativos
        return passouNoTermo && passouNaObra && passouNoStatus && passouNaData;
    });
}