import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createObras, deleteObra, getObra, getObrasCards, updateObra, getObrasTodas } from "../api/apiObras"

export const useObrasCards = (params = {}) => {
    return useQuery({
        queryKey: ['obras-cards', params],
        queryFn: () => getObrasCards(params),
        staleTime: 1000 * 60 * 10,
        placeholderData: (prev) => prev 
    })
}

export const useObrasTodas = () => {
    return useQuery({
        queryKey: ['obras-todas'],
        queryFn: getObrasTodas,
        staleTime: 1000 * 60 * 60 
    })
}

export const useObraDetalhes = (id) => {
    return useQuery({
        queryKey: ['obra-detalhes', id],
        queryFn: () => getObra(id),
        enabled: !!id, 
        staleTime: 1000 * 60 * 10
    })
}
export const useObraMutations = () => {
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: createObras,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['obras-cards']})
        }
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateObra(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['obra-detalhes'] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: deleteObra, 
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['obra-detalhes'] });
            queryClient.invalidateQueries({queryKey: ['obras-cards']})
        }
    });

    return {
        createMutation,
        updateMutation,
        deleteMutation
    }
}