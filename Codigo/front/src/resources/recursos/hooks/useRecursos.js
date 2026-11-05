import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGrupoRecurso, createRecurso, deleteGrupoRecurso, deleteRecurso, getGruposRecurso, getRecursos, getRecursosHierarquia, updateGrupoRecurso, updateRecurso } from "../api/apiRecursos";

export const useRecursosHierarquia = () => {
    return useQuery({
        queryKey: ['recursos-hierarquia'],
        queryFn: getRecursosHierarquia,
        staleTime: 1000 * 60 * 5
    });
};

export const useRecursosLista = () => {
    return useQuery({
        queryKey: ['recursos-lista'],
        queryFn: getRecursos,
        staleTime: 1000 * 60 * 5
    });
};

export const useGruposRecurso = () => {
    return useQuery({
        queryKey: ['grupos-recurso'],
        queryFn: getGruposRecurso,
        staleTime: 1000 * 60 * 5
    });
};

export const useRecursoMutations = () => {
    const queryClient = useQueryClient();

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['recursos-hierarquia'] });
        queryClient.invalidateQueries({ queryKey: ['recursos-lista'] });
        queryClient.invalidateQueries({ queryKey: ['grupos-recurso'] });
    };

    const createMutation = useMutation({
        mutationFn: createRecurso,
        onSuccess: invalidate
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateRecurso(id, data),
        onSuccess: invalidate
    });

    const deleteMutation = useMutation({
        mutationFn: deleteRecurso,
        onSuccess: invalidate
    });

    return { createMutation, updateMutation, deleteMutation };
};

export const useGrupoRecursoMutations = () => {
    const queryClient = useQueryClient();

    const invalidate = () => {
        queryClient.invalidateQueries({ queryKey: ['grupos-recurso'] });
        queryClient.invalidateQueries({ queryKey: ['recursos-hierarquia'] });
        queryClient.invalidateQueries({ queryKey: ['recursos-lista'] });
    };

    const createGrupoMutation = useMutation({
        mutationFn: createGrupoRecurso,
        onSuccess: invalidate
    });

    const updateGrupoMutation = useMutation({
        mutationFn: ({ id, data }) => updateGrupoRecurso(id, data),
        onSuccess: invalidate
    });

    const deleteGrupoMutation = useMutation({
        mutationFn: deleteGrupoRecurso,
        onSuccess: invalidate
    });

    return { createGrupoMutation, updateGrupoMutation, deleteGrupoMutation };
};