import { createContext, useState } from "react";

export const ObrasNotasFiscaisContext = createContext();

export const ObrasNotasFiscaisProvider = ({ children }) => {

    // ── Estado dos modais ────────────────────────────────────────────────
    const [modalType, setModalType] = useState(null);
    const [notaFiscalInfo, setNotaFiscalInfo] = useState(null);
    const [obraInfo, setObraInfo] = useState(null);

    // ── Estado dos filtros ───────────────────────────────────────────────
    const [filtroNumeroNF, setFiltroNumeroNF] = useState('');
    const [filtroDataEmissao, setFiltroDataEmissao] = useState('');
    const [filtroDataVencimento, setFiltroDataVencimento] = useState('');
    const [filtroStatusNF, setFiltroStatusNF] = useState('');
    const [filtroFornecedorId, setFiltroFornecedorId] = useState(null);
    const [filtroFornecedorNome, setFiltroFornecedorNome] = useState('');

    // ── Estado da paginação ──────────────────────────────────────────────
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [tamanhoPagina, setTamanhoPagina] = useState(10);

    const temFiltrosAtivos = !!(
        filtroNumeroNF ||
        filtroDataEmissao ||
        filtroDataVencimento ||
        filtroStatusNF ||
        filtroFornecedorId
    );

    const limparFiltros = () => {
        setFiltroNumeroNF('');
        setFiltroDataEmissao('');
        setFiltroDataVencimento('');
        setFiltroStatusNF('');
        setFiltroFornecedorId(null);
        setFiltroFornecedorNome('');
        setPaginaAtual(0);
    };

    // ── Handlers dos modais ──────────────────────────────────────────────
    const openEditarNotaFiscalModal = (notaFiscal) => {
        setNotaFiscalInfo(notaFiscal);
        setModalType('EDITAR_NF');
    };

    const openAtrelarRecursosModal = (notaFiscal) => {
        setNotaFiscalInfo(notaFiscal);
        setModalType('ATRELAR_RECURSOS');
    };

    const openDeleteNFModal = (notaFiscal) => {
        setNotaFiscalInfo(notaFiscal);
        setModalType('DELETE_NF');
    };

    const closeAllModals = () => {
        setModalType(null);
        setObraInfo(null);
        setNotaFiscalInfo(null);
    };

    return (
        <ObrasNotasFiscaisContext.Provider value={{
            // Modais
            modalType, obraInfo, notaFiscalInfo,
            openDeleteNFModal, closeAllModals,
            openEditarNotaFiscalModal, openAtrelarRecursosModal,
            // Filtros
            filtroNumeroNF, setFiltroNumeroNF,
            filtroDataEmissao, setFiltroDataEmissao,
            filtroDataVencimento, setFiltroDataVencimento,
            filtroStatusNF, setFiltroStatusNF,
            filtroFornecedorId, setFiltroFornecedorId,
            filtroFornecedorNome, setFiltroFornecedorNome,
            temFiltrosAtivos,
            limparFiltros,
            // Paginação
            paginaAtual, setPaginaAtual,
            tamanhoPagina, setTamanhoPagina,
        }}>
            {children}
        </ObrasNotasFiscaisContext.Provider>
    );
};
