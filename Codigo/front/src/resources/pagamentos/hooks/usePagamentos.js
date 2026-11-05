import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { alterarStatus, deletePagamentoNf, getNfCards, lancarPagamento, lancarPagamentoParcelado } from "../api/apiPagamentos"

export const useNfCards = (params = {}) => {
    return useQuery({
        queryKey: ['nf-cards', params], 
        queryFn: () => getNfCards(params),
        staleTime: 1000 * 60 * 10,
        placeholderData: (previousData) => previousData // Evita a tela piscar
    })
}
export const usePagamentoMutations = () => {
    const queryClient = useQueryClient();

    const lancarPagamentoMutation = useMutation({
        mutationFn: lancarPagamento,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['nf-cards']})
        }
    })

    const deleteMutation = useMutation({
        mutationFn: deletePagamentoNf,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey : ['nf-cards']})
        }
    })

    const updateStatusNfMutation = useMutation({
        mutationFn: alterarStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['nf-cards']})
        }
    })

    const lancarPagamentoParceladoMutation = useMutation({
        mutationFn: lancarPagamentoParcelado,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['nf-cards']})
        }
    })

    return {
        lancarPagamentoMutation,
        deleteMutation,
        updateStatusNfMutation,
        lancarPagamentoParceladoMutation
    };
}