import { Children, createContext, useState } from "react";

export const ObrasDetalhesContext = createContext();

export const ObrasDetalhesProvider = ({ children, tarefas = [] }) => {

    const [modalType, setModalType] = useState(null);
    const [obraInfo, setObraInfo] = useState(null);
    const [notaFiscalInfo, setNotaFiscalInfo] = useState(null);


    const openEditModal = (obraInfo) => {
        setObraInfo(obraInfo)
        setModalType('EDIT');
    }

    const openDeleteModal = (obraInfo) => {
        setObraInfo(obraInfo)
        setModalType('DELETE');
    }

    const openLancarNotaFiscalModal = (obra) => {
        setObraInfo(obra); 
        setNotaFiscalInfo(null); 
        setModalType('LANCAR_NF');
    }

    const openAlocarTarefasModal = (obra) => {
        setObraInfo(obra); 
        setModalType('ALOCACAO_ITENS');
    }

    const closeAllModals = () => {
        setModalType(null)
        setObraInfo(null)
        setNotaFiscalInfo(null)
    }

    return (
        <ObrasDetalhesContext.Provider value={{
            modalType, obraInfo, notaFiscalInfo, tarefas,
            openEditModal, openDeleteModal, closeAllModals,
            openLancarNotaFiscalModal, openAlocarTarefasModal
        }} >
            {children}
        </ObrasDetalhesContext.Provider>

    )
}