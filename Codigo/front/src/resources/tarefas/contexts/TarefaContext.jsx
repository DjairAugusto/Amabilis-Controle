import React, { createContext, useContext, useState } from 'react';

export const TarefaContext = createContext();

export const TarefaProvider = ({ children }) => {
    const [expandirGlobal, setExpandirGlobal] = useState(null);

    const expandirTudo = () => setExpandirGlobal(true);
    const recolherTudo = () => setExpandirGlobal(false);

    const [modalType, setModalType] = useState(null);
    const [selectedTarefa, setSelectedTarefa] = useState(null);
    const [parentId, setParentId] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');

    const openCreateModal = (id_pai = null) => {
        setParentId(id_pai);
        setModalType('CREATE');
    }

    const openEditModal = (tarefa) => {
        setSelectedTarefa(tarefa);
        setModalType('EDIT');
    }

    const openDeleteModal = (tarefa) => {
        setSelectedTarefa(tarefa);
        setModalType('DELETE');
    };

    const closeAllModals = () => {
        setModalType(null);
        setSelectedTarefa(null);
        setParentId(null);
    };

    return (
        <TarefaContext.Provider value={{
            expandirGlobal, expandirTudo, recolherTudo,
            modalType, selectedTarefa, parentId,
            openCreateModal, openEditModal, openDeleteModal, closeAllModals,
            searchTerm, setSearchTerm
        }}>
            {children}
        </TarefaContext.Provider>
    );
};