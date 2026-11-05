import { createContext, useState } from "react";

export const PagamentoContext = createContext();

export const PagamentoProvider = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroObra, setFiltroObra] = useState('');
    const [filtroStatus, setFiltroStatus] = useState('');
    const [filtroDataVencimento, setFiltroDataVencimento] = useState('');

    const [paginaAtual, setPaginaAtual] = useState(0);
    const [tamanhoPagina, setTamanhoPagina] = useState(10);

    const [modalType, setModalType] = useState(null);
    const [pagamentoSelecionado, setPagamentoSelecionado] = useState(null);

    const openModal = (type, data = null) => {
        setModalType(type);
        if (data) setPagamentoSelecionado(data);
    };

    const closeAllModals = () => {
        setModalType(null);
        setPagamentoSelecionado(null);
    };

    return(
        <PagamentoContext.Provider value={{
            searchTerm, setSearchTerm,
            filtroObra, setFiltroObra,
            filtroStatus, setFiltroStatus,
            filtroDataVencimento, setFiltroDataVencimento,
            paginaAtual, setPaginaAtual,
            tamanhoPagina, setTamanhoPagina,
            modalType, openModal, closeAllModals, pagamentoSelecionado
        }}>
            {children} 
        </PagamentoContext.Provider>
    )
}