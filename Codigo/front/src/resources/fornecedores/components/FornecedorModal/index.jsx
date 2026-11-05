import React, { useState, useEffect } from 'react';
import Modal from '../../../../components/layout/Modal';
import Input from '../../../../components/ui/Input';
import Dropdown from '../../../../components/ui/Dropdown';
import { useFornecedorContext } from '../../hooks/useFornecedorContext';
import { createFornecedor, updateFornecedor } from '../../api/apiFornecedores';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCep } from '../../../../hooks/useCep';
import './FornecedorModal.css';

const FornecedorModal = () => {
    const { isModalOpen, fecharModal, modalConfig } = useFornecedorContext();
    const { acao, dados } = modalConfig;
    
    const [formData, setFormData] = useState({});
    const queryClient = useQueryClient();

    const { isLoadingCep } = useCep(formData.cep, (endereco) => {
        setFormData(prev => ({
            ...prev,
            logradouro: endereco.logradouro || prev.logradouro || '',
            bairro: endereco.bairro || prev.bairro || '',
            cidade: endereco.localidade || prev.cidade || '',
            uf: endereco.uf || prev.uf || ''
        }));
    });

    useEffect(() => {
        if (isModalOpen) {
            if (dados) {
                // Transformar dados do fornecedor (camelCase) para o formato do formulário (snake_case)
                setFormData({
                    razao_social: dados.razaoSocial || '',
                    nome_fantasia: dados.nomeFantasia || '',
                    cnpj: dados.documento || '',
                    codigo_fornecedor: dados.codigoFornecedor || '',
                    logradouro: dados.endereco?.logradouro || '',
                    numero: dados.endereco?.numeroEndereco || '',
                    cep: dados.endereco?.cep || '',
                    bairro: dados.endereco?.bairro || '',
                    cidade: dados.endereco?.cidade || '',
                    uf: dados.endereco?.estado || '',
                    status: dados.statusFornecedor ? 'Ativo' : 'Inativo'
                });
            } else {
                setFormData({ status: 'Ativo' });
            }
        }
    }, [isModalOpen, dados]);

    const handleChange = (campo, valor) => {
        setFormData(prev => ({ ...prev, [campo]: valor }));
    };

    const criarMutation = useMutation({
        mutationFn: createFornecedor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
            fecharModal();
        },
        onError: (error) => alert("Erro ao cadastrar: " + error.message)
    });

    const editarMutation = useMutation({
        mutationFn: ({ id, data }) => updateFornecedor(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fornecedores'] });
            fecharModal();
        },
        onError: (error) => alert("Erro ao editar: " + error.message)
    });

    const handleSalvar = () => {
        const payload = {
            id: dados?.id || null,
            codigoFornecedor: formData.codigoFornecedor || Math.floor(Math.random() * 10000),
            razaoSocial: formData.razao_social || "",
            nomeFantasia: formData.nome_fantasia || "",
            tipoDocumento: "CNPJ",
            documento: String(formData.cnpj || "").replace(/\D/g, ""),
            statusFornecedor: formData.status === 'Ativo',
            endereco: {
                logradouro: formData.logradouro || "",
                numeroEndereco: formData.numero || "",
                cep: parseInt(String(formData.cep).replace(/\D/g, "")) || 0,
                bairro: formData.bairro || "",
                cidade: formData.cidade || "",
                estado: formData.uf || ""
            }
        };

        if (acao === 'editar' && dados?.id) {
            editarMutation.mutate({ id: dados.id, data: payload });
        } else {
            criarMutation.mutate(payload);
        }
    };

    let tituloModal = acao === 'editar' ? "Editar Fornecedor" : "Cadastrar novo Fornecedor";
    let textoBotao = criarMutation.isPending || editarMutation.isPending ? "SALVANDO..." : (acao === 'editar' ? "SALVAR ALTERAÇÕES" : "CADASTRAR");

    const botaoSalvar = {
        color: "primary-button",
        texto: textoBotao,
        aoClicar: handleSalvar
    };

    return (
        <Modal isOpen={isModalOpen} onClose={fecharModal} title={tituloModal} botao={botaoSalvar} specificModal="fornecedor-modal">
            <div className="fornecedor-form-container">
                <Input label="Razão Social" typeInput="text" placeholder="Ex: Empresa Teste" value={formData.razao_social || ''} onChange={(e) => handleChange('razao_social', e.target.value)} />
                <div className="dois-colunas">
                    <Input label="Nome Fantasia" typeInput="text" placeholder="Ex: Fantasia" value={formData.nome_fantasia || ''} onChange={(e) => handleChange('nome_fantasia', e.target.value)} />
                    <Input label="CNPJ" typeInput="text" placeholder="Ex: 00.000.000/0001-00" mask="cnpj" value={formData.cnpj || ''} onChange={(e) => handleChange('cnpj', e.target.value)} />
                </div>
                <div className="dois-colunas">
                    <Input label="Logradouro" typeInput="text" placeholder="Ex: Rua X" value={formData.logradouro || ''} onChange={(e) => handleChange('logradouro', e.target.value)} />
                    <Input label="Número" typeInput="text" placeholder="Ex: 123" value={formData.numero || ''} onChange={(e) => handleChange('numero', e.target.value)} />
                </div>
                <div className="dois-colunas">
                    <Input label="CEP" typeInput="text" placeholder="Ex: 00000-000" mask="cep" value={formData.cep || ''} onChange={(e) => handleChange('cep', e.target.value)} />
                    <Input label="Bairro" typeInput="text" placeholder="Ex: Centro" value={formData.bairro || ''} onChange={(e) => handleChange('bairro', e.target.value)} />
                </div>
                <div className="dois-colunas">
                    <Input label="Cidade" typeInput="text" placeholder="Ex: São Paulo" value={formData.cidade || ''} onChange={(e) => handleChange('cidade', e.target.value)} />
                    <Input label="UF" typeInput="text" placeholder="Ex: SP" value={formData.uf || ''} onChange={(e) => handleChange('uf', e.target.value)} />
                </div>
            </div>
        </Modal>
    );
};

export default FornecedorModal;