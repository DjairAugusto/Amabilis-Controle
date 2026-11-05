import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createTarefas, deleteTarefa, getTarefasAll, updateTarefa } from "../api/apiTarefas"

export const useTarefas = () => {
    return useQuery({
        queryKey: ['tarefas-hierarquia'],
        queryFn: getTarefasAll,
        staleTime: 1000 * 60 * 10
    })
}

export const useTarefaMutations = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createTarefas,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['tarefas-hierarquia']})
        }
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateTarefa(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tarefas-hierarquia'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTarefa, 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tarefas-hierarquia'] });
        }
    });

    return {
        createMutation,
        updateMutation,
        deleteMutation
    }
}
