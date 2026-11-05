import "./NotasFiscaisObras.css";
import { useMemo } from "react";
import TabelaNotasFiscais from "../../../resources/obrasDetalhes/components/notasFiscais/TabelaNotasFiscais";
import FiltrosNotasFiscais from "../../../resources/obrasDetalhes/components/notasFiscais/FiltrosNotasFiscais";
import { useNotasFiscaisDaObra } from "../../../resources/obrasDetalhes/hooks/useNotasFiscais";
import { ObrasNotasFiscaisProvider } from "../../../resources/obrasDetalhes/contexts/ObrasNotasFiscaisContext";
import { useNotasFiscaisContext } from "../../../resources/obrasDetalhes/hooks/useNotasFiscaisContext";
import ModalNfObrasManager from "../../../resources/obrasDetalhes/components/notasFiscais/modals/ModalNFObrasManager";

const NotasFiscaisObrasContent = ({ obra }) => {
    const {
        filtroNumeroNF,
        filtroDataEmissao,
        filtroDataVencimento,
        filtroStatusNF,
        filtroFornecedorId,
        paginaAtual,
        tamanhoPagina,
    } = useNotasFiscaisContext();

    const params = useMemo(() => {
        const p = {
            pagina: paginaAtual,
            tamanhoPagina,
        };
        if (filtroNumeroNF)     p.numeroDocumento  = filtroNumeroNF;
        if (filtroDataEmissao)  p.dataEmissao      = filtroDataEmissao;
        if (filtroDataVencimento) p.dataVencimento = filtroDataVencimento;
        if (filtroStatusNF)     p.statusNotaFiscal = filtroStatusNF;
        if (filtroFornecedorId) p.fornecedorId     = filtroFornecedorId;
        return p;
    }, [filtroNumeroNF, filtroDataEmissao, filtroDataVencimento, filtroStatusNF, filtroFornecedorId, paginaAtual, tamanhoPagina]);

    const { data: paginaResponse, isLoading, isError } = useNotasFiscaisDaObra(obra?.id, params);

    if (isError) return (
        <p style={{ textAlign: 'center', padding: '20px', color: 'red' }}>
            Erro ao carregar notas fiscais.
        </p>
    );

    return (
        <div className="notas-fiscais-obras">
            <div className="notas-fiscais-obras-toolbar">
                <FiltrosNotasFiscais />
            </div>

            <TabelaNotasFiscais
                notasFiscais={paginaResponse?.conteudo || []}
                totalElementos={paginaResponse?.totalElementos ?? 0}
                quantidadeElementos={paginaResponse?.quantidadeElementos ?? 0}
                totalPaginas={paginaResponse?.totalPaginas ?? 0}
                isLoading={isLoading}
            />
        </div>
    );
};

const NotasFiscaisObras = ({ obra }) => {
    return (
        <ObrasNotasFiscaisProvider>
            <NotasFiscaisObrasContent obra={obra} />
            <ModalNfObrasManager />
        </ObrasNotasFiscaisProvider>
    );
};

export default NotasFiscaisObras;