import { useMemo } from 'react';
import './Obras.css';
import ObrasHeader from '../../resources/obras/components/ObrasHeader';
import CardsObras from '../../resources/obras/components/CardsObras';
import { ObraProvider } from '../../resources/obras/contexts/ObraContext';
import { useObraContext } from '../../resources/obras/hooks/useObraContext';
import { useObrasCards } from '../../resources/obras/hooks/useObras';
import PaginacaoObras from '../../resources/obras/components/PaginacaoObras'; // 🟢 Import do Paginador

const ObrasContent = () => {
    const { searchTerm, paginaAtual, tamanhoPagina } = useObraContext();

    // 🟢 Agrupa os parâmetros 
    const params = useMemo(() => {
        const p = { pagina: paginaAtual, tamanhoPagina };
        if (searchTerm) p.termo = searchTerm;
        return p;
    }, [searchTerm, paginaAtual, tamanhoPagina]);

    const { data: paginaResponse, isLoading, isFetching, isError } = useObrasCards(params);
    const cards = paginaResponse?.conteudo || [];

    return (
        <section className="obras-section">
            <ObrasHeader />
            
            {/* Opcional: Efeito de esmaecer durante a troca de página */}
            <div className="obras-grid" style={{ transition: 'opacity 0.3s ease', opacity: isFetching ? 0.6 : 1 }}>
                {isLoading ? (
                    <p>Carregando obras...</p>
                ) : isError ? (
                    <p>Erro ao carregar obras. Tente novamente.</p>
                ) : cards.length === 0 ? (
                    <p>Nenhuma obra encontrada.</p>
                ) : (
                    cards.map((obra) => (
                        <CardsObras key={obra.id} obra={obra} />
                    ))
                )}
            </div>

            {/* 🟢 Renderizando a paginação embaixo dos cards */}
            {!isLoading && !isError && paginaResponse && (
                <PaginacaoObras
                    totalElementos={paginaResponse.totalElementos}
                    quantidadeElementos={paginaResponse.quantidadeElementos}
                    totalPaginas={paginaResponse.totalPaginas}
                />
            )}
        </section>
    );
}

const Obras = () => {
    return (
        <ObraProvider>
            <ObrasContent />
        </ObraProvider>
    )
}

export default Obras;