/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteFornecedor } from '../api/apiFornecedores';

export const FornecedorContext = createContext();

export const FornecedorProvider = ({ children }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({ acao: '', dados: null });
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedFornecedor, setSelectedFornecedor] = useState(null);

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteFornecedor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
        },
        onError: (error) => {
            alert("Erro ao excluir fornecedor: " + error.message);
        }
    });

    const abrirModal = (acao, dados = null) => {
        setModalConfig({ acao, dados });
        setIsModalOpen(true);
    };

    const fecharModal = () => {
        setIsModalOpen(false);
        setModalConfig({ acao: '', dados: null });
    };

    const abrirModalDelete = (fornecedor) => {
        setSelectedFornecedor(fornecedor);
        setIsDeleteModalOpen(true);
    };

    const fecharModalDelete = () => {
        setIsDeleteModalOpen(false);
        setSelectedFornecedor(null);
    };

    return (
        <FornecedorContext.Provider value={{
            isModalOpen,
            setIsModalOpen,
            modalConfig,
            abrirModal,
            fecharModal,
            isDeleteModalOpen,
            setIsDeleteModalOpen,
            selectedFornecedor,
            abrirModalDelete,
            fecharModalDelete,
            deleteMutation
        }}>
            {children}
        </FornecedorContext.Provider>
    );
};