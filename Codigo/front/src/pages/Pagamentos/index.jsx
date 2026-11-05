import { useMemo } from "react"
import PagamentosHeader from "../../resources/pagamentos/components/PagamentosHeader"
import "./Pagamentos.css"
import NfCard from "../../resources/pagamentos/components/NfCard"
import { PagamentoProvider } from "../../resources/pagamentos/contexts/PagamentoContext"
import { usePagamentoContext } from "../../resources/pagamentos/hooks/usePagamentoContext"
import DeletePagamentoModal from "../../resources/pagamentos/components/Modal/ModalDeletePagamento"
import { useNfCards } from "../../resources/pagamentos/hooks/usePagamentos"
import PaginacaoPagamentos from "../../resources/pagamentos/components/PaginacaoPagamentos" 
import { MAPA_STATUS_BACKEND } from "../../resources/pagamentos/utils/statusNotaFiscal"

// Função blindada contra fuso horário para formatar datas para o Back-end (YYYY-MM-DD)
const formatarParaAPI = (data) => {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
};

const calcularDatasFiltro = (filtroData) => {
    if (!filtroData || filtroData === 'Qualquer Data') return { inicio: null, fim: null };
    
    const hoje = new Date();
    const dataInicio = formatarParaAPI(hoje);
    
    const dataFimCalculada = new Date();
    if (filtroData === 'Esta Semana') dataFimCalculada.setDate(hoje.getDate() + 7);
    else if (filtroData === 'Próximos 15 dias') dataFimCalculada.setDate(hoje.getDate() + 15);
    else if (filtroData === 'Próximo Mês') dataFimCalculada.setDate(hoje.getDate() + 30);
    else if (filtroData === 'Próximos 3 Meses') dataFimCalculada.setDate(hoje.getDate() + 90);
    else if (filtroData === 'Próximos 6 Meses') dataFimCalculada.setDate(hoje.getDate() + 180);
    
    return { inicio: dataInicio, fim: formatarParaAPI(dataFimCalculada) };
}

const PagamentosContent = () => {
    const { 
        searchTerm, filtroObra, filtroStatus, filtroDataVencimento, 
        paginaAtual, tamanhoPagina 
    } = usePagamentoContext();

    // 1. Monta os parâmetros e recarrega automaticamente quando o usuário altera um filtro
    const params = useMemo(() => {
        const p = { pagina: paginaAtual, tamanhoPagina };
        
        if (searchTerm) p.termo = searchTerm;
        if (filtroObra && filtroObra !== 'Todas as Obras') p.nomeObra = filtroObra;
        if (filtroStatus && filtroStatus !== 'Todos os Status') p.statusNotaFiscal = MAPA_STATUS_BACKEND[filtroStatus];
        
        const { inicio, fim } = calcularDatasFiltro(filtroDataVencimento);
        if (inicio) p.dataVencimentoInicio = inicio;
        if (fim) p.dataVencimentoFim = fim;

        return p;
    }, [searchTerm, filtroObra, filtroStatus, filtroDataVencimento, paginaAtual, tamanhoPagina]);

    // 2. Dispara a query enviando os parâmetros para o Back-end
    const { data: paginaResponse, isLoading, isFetching, isError} = useNfCards(params);

    // 3. Extrai apenas o array "conteudo" que vem na resposta paginada
    const cards = paginaResponse?.conteudo || [];

    return (
        <section className="pagamentos-section">
            <PagamentosHeader />
            <div className="pagamentos-cards-container">
                { isLoading ? (
                    <p>Carregando pagamentos...</p>
                ) : isFetching ? (
                    <div className="loading-transition">
                        <p>Atualizando cards...</p>
                    </div>
                ) : isError ? (
                    <p>Erro ao carregar pagamentos. Tente novamente.</p>
                ) : cards.length === 0 ? (
                    <div className='tarefas-vazias'>
                        <p>Nenhuma Nota Fiscal encontrada com os filtros selecionados.</p>
                    </div>
                ) : (
                    cards.map((card) => (
                        <NfCard key={card.id} card={card} />
                    ))
                )}
            </div>

            {/* Renderiza a paginação lendo os dados do Objeto que o Back-end mandou */}
            {!isLoading && !isError && paginaResponse && (
                <PaginacaoPagamentos 
                    totalElementos={paginaResponse.totalElementos}
                    quantidadeElementos={paginaResponse.quantidadeElementos}
                    totalPaginas={paginaResponse.totalPaginas}
                />
            )}

            <DeletePagamentoModal />
        </section>
    )
}

const Pagamentos = () => {
    return (
        <PagamentoProvider>
            <PagamentosContent />
        </PagamentoProvider>
    )
}

export default Pagamentos;