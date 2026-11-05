import React, { createContext, useMemo, useState, useEffect } from 'react';
import { useGrupoRecursoMutations, useGruposRecurso, useRecursoMutations, useRecursosHierarquia, useRecursosLista } from '../hooks/useRecursos';

export const RecursoContext = createContext();

const TIPOS_FIXOS = ['MATERIAL', 'EQUIPAMENTO', 'INDIRETO', 'MAO_DE_OBRA_DIRETO', 'SERVICO_DE_TERCEIRO'];

const adaptarDadosDaApi = (dadosBackend, gruposRecurso) => {
    const recursosPorGrupo = {};
    (dadosBackend || []).forEach((recurso) => {
        const grupoId = recurso.grupoRecursoId || 0;
        if (!recursosPorGrupo[grupoId]) recursosPorGrupo[grupoId] = [];
        recursosPorGrupo[grupoId].push({
            id_recurso: recurso.id,
            codigo_recurso: recurso.codigoHierarquico,
            descricao: recurso.descricao,
            unidade_medida: recurso.unidadeMedida || 'UN',
            children: recurso.children || []
        });
    });

    const gruposPorTipo = {};
    TIPOS_FIXOS.forEach(tipo => { gruposPorTipo[tipo] = []; });

    (gruposRecurso || []).forEach((grupo) => {
        let tipo = grupo.tipoRecurso || 'SEM_TIPO';
        if (tipo === 'MATERIAL_INDIRETO' || tipo === 'MATERIAL INDIRETO') {
            tipo = 'INDIRETO';
        }

        if (!gruposPorTipo[tipo]) gruposPorTipo[tipo] = [];
        gruposPorTipo[tipo].push({
            id_grupo: grupo.id,
            nome_grupo: grupo.nomeGrupo,
            tipoRecurso: tipo,
            recursos: recursosPorGrupo[grupo.id] || []
        });
    });

    return TIPOS_FIXOS.map((tipo, index) => ({
        id_tipo: index + 1,
        nome_tipo: tipo,
        grupos: gruposPorTipo[tipo] || []
    }));
};

export const RecursoProvider = ({ children }) => {
    const [tiposAbertos, setTiposAbertos] = useState([]);
    const [gruposAbertos, setGruposAbertos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({ acao: '', dados: null });

    const { data: recursosHierarquia = [], isLoading, error } = useRecursosHierarquia();
    const { data: recursosLista = [] } = useRecursosLista();
    const { data: gruposRecurso = [] } = useGruposRecurso();
    const { createMutation, updateMutation, deleteMutation } = useRecursoMutations();
    
    const { createGrupoMutation, updateGrupoMutation, deleteGrupoMutation } = useGrupoRecursoMutations();

    const dadosBase = useMemo(
        () => adaptarDadosDaApi(recursosHierarquia, gruposRecurso),
        [recursosHierarquia, gruposRecurso]
    );

    const toggleTipo = (tipoId) => {
        setTiposAbertos(prev => prev.includes(tipoId) ? prev.filter(id => id !== tipoId) : [...prev, tipoId]);
    };

    const toggleGrupo = (grupoId) => {
        setGruposAbertos(prev => prev.includes(grupoId) ? prev.filter(id => id !== grupoId) : [...prev, grupoId]);
    };

    const expandirTudo = () => {
        const todosTipos = (dadosBase || []).map(t => t.id_tipo);
        const todosGrupos = (dadosBase || []).flatMap(t => (t.grupos || []).map(g => g.id_grupo));
        setTiposAbertos(todosTipos);
        setGruposAbertos(todosGrupos);
    };

    const recolherTudo = () => {
        setTiposAbertos([]);
        setGruposAbertos([]);
    };

    const recursosFiltrados = useMemo(() => {
        if (!searchTerm) return dadosBase || [];
        const termoMin = searchTerm.toLowerCase();

        return (dadosBase || []).reduce((accTipo, tipo) => {
            const isTipoMatch = (tipo.nome_tipo?.toLowerCase() || '').includes(termoMin);
            const gruposFiltrados = (tipo.grupos || []).reduce((accGrupo, grupo) => {
                const isGrupoMatch = (grupo.nome_grupo?.toLowerCase() || '').includes(termoMin);
                const recsFiltrados = (grupo.recursos || []).filter(rec =>
                    (rec.descricao?.toLowerCase() || '').includes(termoMin) ||
                    (rec.codigo_recurso?.toLowerCase() || '').includes(termoMin)
                );
                if (isGrupoMatch || recsFiltrados.length > 0) {
                    accGrupo.push({ ...grupo, recursos: isGrupoMatch && recsFiltrados.length === 0 ? grupo.recursos : recsFiltrados });
                }
                return accGrupo;
            }, []);

            if (isTipoMatch || gruposFiltrados.length > 0) {
                accTipo.push({ ...tipo, grupos: isTipoMatch && gruposFiltrados.length === 0 ? tipo.grupos : gruposFiltrados });
            }
            return accTipo;
        }, []);
    }, [searchTerm, dadosBase]);

    useEffect(() => {
        if (searchTerm.trim() !== '') {
            setTiposAbertos(recursosFiltrados.map(t => t.id_tipo));
            setGruposAbertos(recursosFiltrados.flatMap(t => (t.grupos || []).map(g => g.id_grupo)));
        }
    }, [searchTerm, recursosFiltrados]);

    const abrirModal = (acao, dados = null) => {
        setModalConfig({ acao, dados });
        setIsModalOpen(true);
    };

    const fecharModal = () => {
        setIsModalOpen(false);
        setModalConfig({ acao: '', dados: null });
    };

    const excluirItem = (tipo, id) => {
        const confirmacao = window.confirm('Tem certeza que deseja excluir?');
        if (!confirmacao) return;

        if (tipo === 'grupo') {
            deleteGrupoMutation.mutate(id);
        } else {
            deleteMutation.mutate(id);
        }
    };

    const recursosFlat = useMemo(() => {
        const flatten = (nodes = []) => nodes.flatMap((node) => [
            { id: node.id, descricao: node.descricao },
            ...flatten(node.children || [])
        ]);
        if (recursosHierarquia.length > 0) return flatten(recursosHierarquia);
        return recursosLista;
    }, [recursosHierarquia, recursosLista]);

    return (
        <RecursoContext.Provider value={{
            recursosFiltrados, searchTerm, setSearchTerm,
            recursosHierarquia, recursosFlat, gruposRecurso, isLoading, error,
            expandirTudo, recolherTudo, tiposAbertos, gruposAbertos, toggleTipo, toggleGrupo,
            isModalOpen, modalConfig, abrirModal, fecharModal, excluirItem,
            createMutation, updateMutation, deleteMutation, createGrupoMutation, updateGrupoMutation, deleteGrupoMutation
        }}>
            {children}
        </RecursoContext.Provider>
    );
};