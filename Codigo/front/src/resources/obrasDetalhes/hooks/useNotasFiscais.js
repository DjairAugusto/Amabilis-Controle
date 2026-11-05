import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    getNotasFiscaisPorObra,
    getNotaFiscal,
    criarNotaFiscal,
    atualizarNotaFiscal,
    deletarNotaFiscal,
    atrelarRecursosATarefas,
    getItensNotaFiscal
} from "../api/apiNotasFiscais";

export const useNotasFiscaisDaObra = (obraId, params = {}) => {
    return useQuery({
        queryKey: ['notas-fiscais', 'obra', obraId, params],
        queryFn: () => getNotasFiscaisPorObra(obraId, params),
        enabled: !!obraId,
        staleTime: 1000 * 60 * 5,
        placeholderData: (previousData) => previousData,
    });
}

export const useNotaFiscalDetalhes = (id) => {
    return useQuery({
        queryKey: ['nota-fiscal', id],
        queryFn: () => getNotaFiscal(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 5
    });
}

export const useItensNotaFiscal = (notaFiscalId) => {
    return useQuery({
        queryKey: ['nota-fiscal', notaFiscalId, 'itens'],
        queryFn: () => getItensNotaFiscal(notaFiscalId),
        enabled: !!notaFiscalId,
        staleTime: 1000 * 60 * 5
    });
}

export const useNotasFiscaisMutations = (obraId) => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: (data) => criarNotaFiscal(obraId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notas-fiscais', 'obra', obraId] });
            queryClient.invalidateQueries({ queryKey: ['obra-detalhes', obraId] });
        }
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => atualizarNotaFiscal(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notas-fiscais', 'obra', obraId] });
            queryClient.invalidateQueries({ queryKey: ['obra-detalhes', obraId] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => deletarNotaFiscal(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notas-fiscais', 'obra', obraId] });
            queryClient.invalidateQueries({ queryKey: ['obra-detalhes', obraId] });
        }
    });

    const atrelarRecursosMutation = useMutation({
        mutationFn: ({ notaFiscalId, lote }) => atrelarRecursosATarefas(notaFiscalId, lote),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['obra-detalhes', obraId] });
        }
    });

    return {
        createMutation,
        updateMutation,
        deleteMutation,
        atrelarRecursosMutation
    };
}