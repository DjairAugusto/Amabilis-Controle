import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../../../../components/layout/Modal';
import Input from '../../../../components/ui/Input';
import Dropdown from '../../../../components/ui/Dropdown';
import { useRecursoContext } from '../../hooks/useRecursoContext';
import { UNIDADES_MEDIDA } from '../../../../data/unidadesDeMedida';
import './RecursoModal.css';

const RecursoModal = () => {
    const {
        isModalOpen,
        fecharModal,
        modalConfig,
        recursosFlat,
        gruposRecurso,
        createMutation,
        updateMutation,
        createGrupoMutation,
        updateGrupoMutation
    } = useRecursoContext();

    const { acao, dados } = modalConfig;

    const [descricao, setDescricao] = useState('');
    const [unidadeMedida, setUnidadeMedida] = useState('');
    const [grupoRecursoId, setGrupoRecursoId] = useState('');
    const [recursoPaiId, setRecursoPaiId] = useState('');
    const [descricaoGrupo, setDescricaoGrupo] = useState('');
    const [tipoGrupo, setTipoGrupo] = useState('MATERIAL');

    const TIPOS_RECURSO = [
        'MATERIAL',
        'EQUIPAMENTO',
        'SERVICO_DE_TERCEIRO',
        'MAO_DE_OBRA_DIRETO',
        'INDIRETO'
    ];

    const formatarTipoLocal = (tipo) => {
        if (!tipo) return '';
        if (tipo === 'INDIRETO') return 'Indireto';
        return tipo
            .replaceAll('_', ' ')
            .toLowerCase()
            .replace(/(^|\s)\S/g, (letra) => letra.toUpperCase());
    };

    const getErrorMessage = (error, fallback) => {
        if (!error?.response) {
            return 'Nao foi possivel conectar com a API. Verifique se o backend esta em execucao na porta 8080.';
        }

        const apiMessage = error?.response?.data?.message;
        if (typeof apiMessage === 'string' && apiMessage.trim()) {
            return apiMessage;
        }
        return fallback;
    };

    useEffect(() => {
        if (!isModalOpen) return;

        if (acao === 'editar_recurso' && dados) {
            setDescricao(dados.descricao || '');
            setUnidadeMedida(dados.unidadeMedida || '');
            setGrupoRecursoId(String(dados.grupoRecursoId || ''));
            setRecursoPaiId(dados.recursoPaiId ? String(dados.recursoPaiId) : '');
            return;
        }

        if (acao === 'novo_recurso' && dados?.grupo) {
            setDescricao('');
            setUnidadeMedida('');
            setGrupoRecursoId(String(dados.grupo.id_grupo || '')); 
            setRecursoPaiId('');
            return;
        }

        if (acao === 'novo_recurso_global' && dados?.tipoRecurso) {
            setDescricao('');
            setUnidadeMedida('');
            setGrupoRecursoId(dados?.grupoRecursoId ? String(dados.grupoRecursoId) : '');
            setRecursoPaiId('');
            return;
        }

        if (acao === 'novo_grupo') {
            setDescricaoGrupo('');
            setTipoGrupo(dados?.tipoRecurso || 'MATERIAL');
            return;
        }

        if (acao === 'editar_grupo' && dados) {
            setDescricaoGrupo(dados?.nomeGrupo || '');
            setTipoGrupo(dados?.tipoRecurso || 'MATERIAL');
            return;
        }

        setDescricao('');
        setUnidadeMedida('');
        setGrupoRecursoId('');
        setRecursoPaiId('');
    }, [isModalOpen, acao, dados]);

    let tituloModal = "Cadastrar Recurso";
    if (acao === 'novo_recurso_global') tituloModal = "Cadastrar Recurso";
    if (acao === 'novo_recurso') tituloModal = `Cadastrar Recurso`;
    if (acao === 'editar_recurso') tituloModal = "Editar Recurso";
    if (acao === 'novo_grupo') tituloModal = "Cadastro de Grupo";
    if (acao === 'editar_grupo') tituloModal = "Atualizar Grupo";

    const mostrarRecursos = ['novo_recurso_global', 'novo_recurso', 'editar_recurso'].includes(acao);
    const mostrarGrupo = ['novo_grupo', 'editar_grupo'].includes(acao);
    const tipoSelecionado = dados?.tipoRecurso || dados?.tipo?.nome_tipo || dados?.recursoPai?.tipoRecurso || null;

    const gruposDisponiveis = useMemo(() => {
        const gruposMap = new Map();
        gruposRecurso.forEach((grupo) => {
            if (tipoSelecionado && grupo.tipoRecurso !== tipoSelecionado) return;
            if (grupo.id && !gruposMap.has(grupo.id)) {
                gruposMap.set(grupo.id, { id: grupo.id, nome: grupo.nomeGrupo || `Grupo ${grupo.id}` });
            }
        });
        recursosFlat.forEach((recurso) => {
            if (tipoSelecionado && recurso.tipoRecurso !== tipoSelecionado) return;
            if (recurso.grupoRecursoId && !gruposMap.has(recurso.grupoRecursoId)) {
                gruposMap.set(recurso.grupoRecursoId, { id: recurso.grupoRecursoId, nome: recurso.grupoRecursoNome || `Grupo ${recurso.grupoRecursoId}` });
            }
        });
        return Array.from(gruposMap.values());
    }, [gruposRecurso, recursosFlat, tipoSelecionado]);

    const grupoSelecionado = useMemo(() => {
        if (!grupoRecursoId) return '';
        const grupo = gruposDisponiveis.find((item) => String(item.id) === String(grupoRecursoId));
        return grupo ? grupo.nome : '';
    }, [grupoRecursoId, gruposDisponiveis]);

    const handleSalvarRecurso = () => {
        if (!descricao.trim() || !grupoRecursoId || !unidadeMedida) {
            alert('Preencha descrição, grupo e unidade de medida.');
            return;
        }
        const payload = {
            id: dados?.id || null,
            codigoHierarquico: dados?.codigoHierarquico || null,
            recursoPaiId: recursoPaiId ? Number(recursoPaiId) : null,
            descricao: descricao.trim(),
            grupoRecursoId: Number(grupoRecursoId),
            unidadeMedida
        };
        if (acao === 'editar_recurso' && dados?.id) {
            updateMutation.mutate({ id: dados.id, data: payload }, {
                onSuccess: () => fecharModal(),
                onError: (error) => alert(getErrorMessage(error, 'Nao foi possivel atualizar o recurso.'))
            });
            return;
        }
        createMutation.mutate(payload, {
            onSuccess: () => fecharModal(),
            onError: (error) => alert(getErrorMessage(error, 'Nao foi possivel cadastrar o recurso.'))
        });
    };

    const handleSalvarGrupo = () => {
        if (!descricaoGrupo.trim() || !tipoGrupo) {
            alert('Preencha descrição e tipo do grupo.');
            return;
        }

        const payload = {
            nomeGrupo: descricaoGrupo.trim(),
            tipoRecurso: tipoGrupo
        };

        if (acao === 'editar_grupo' && dados?.id) {
            payload.id = dados.id;
            updateGrupoMutation.mutate({ id: dados.id, data: payload }, {
                onSuccess: () => fecharModal(),
                onError: (error) => alert(getErrorMessage(error, 'Nao foi possivel atualizar o grupo.'))
            });
            return;
        }

        createGrupoMutation.mutate(payload, {
            onSuccess: () => fecharModal(),
            onError: (error) => alert(getErrorMessage(error, 'Nao foi possivel cadastrar o grupo.'))
        });
    };

    const isPendingGrupo = createGrupoMutation.isPending || updateGrupoMutation.isPending;
    const isPendingRecurso = createMutation.isPending || updateMutation.isPending;

    const botaoSalvar = {
        color: "primary-button",
        texto: (mostrarGrupo ? isPendingGrupo : isPendingRecurso) ? "SALVANDO..." : (acao === 'editar_grupo' ? 'SALVAR ALTERAÇÕES' : acao === 'editar_recurso' ? 'SALVAR' : 'CADASTRAR'),
        aoClicar: mostrarGrupo ? handleSalvarGrupo : handleSalvarRecurso
    };

    return (
        <Modal isOpen={isModalOpen} onClose={fecharModal} title={tituloModal} botao={botaoSalvar} specificModal={mostrarGrupo ? 'modal-grupo' : ''}>
            {mostrarRecursos && (
                <div className='recurso-modal-form'>
                    <Input label="Descrição" typeInput="text" placeholder="Ex: Lorem Ipsum Teste" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                    <div className='recurso-modal-grid'>
                        <Dropdown label="Unidade" opcoes={UNIDADES_MEDIDA} placeholder="UN" valorDrop={unidadeMedida} onSelect={(valor) => setUnidadeMedida(valor)} />
                        <Dropdown label="Grupo" opcoes={gruposDisponiveis.map((grupo) => grupo.nome)} placeholder="Grupo" valorDrop={grupoSelecionado} onSelect={(nomeGrupo) => {
                            const grupo = gruposDisponiveis.find((item) => item.nome === nomeGrupo);
                            setGrupoRecursoId(grupo ? String(grupo.id) : '');
                        }} />
                    </div>
                </div>
            )}

            {mostrarGrupo && (
                <div className='recurso-modal-form'>
                    <Input label="Descrição" typeInput="text" placeholder="Ex: Lorem Ipsum Teste" value={descricaoGrupo} onChange={(e) => setDescricaoGrupo(e.target.value)} />
                    <Dropdown 
                        label="Tipo" 
                        opcoes={TIPOS_RECURSO.map(t => formatarTipoLocal(t))} 
                        placeholder="Material" 
                        valorDrop={formatarTipoLocal(tipoGrupo)} 
                        onSelect={(valor) => {
                            const original = TIPOS_RECURSO.find(t => formatarTipoLocal(t) === valor);
                            setTipoGrupo(original);
                        }} 
                    />
                </div>
            )}
        </Modal>
    );
};

export default RecursoModal;