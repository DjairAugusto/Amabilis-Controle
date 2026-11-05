import { useMutation, useQueryClient } from "@tanstack/react-query"
import { atribuirTarefas , atualizarStatusItemObra} from "../api/apiItensObra"

export const useItensObraMutations = () => {
    const queryClient = useQueryClient();

    const atribuirTarefasMutation = useMutation({
        mutationFn: ({ obraId, data }) => atribuirTarefas(obraId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['obra-detalhes'] });
        }
    });

    const atualizarStatusMutation = useMutation({
        mutationFn: ({ itemId, data }) => atualizarStatusItemObra(itemId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['obra-detalhes'] });
        }
    });

    return {
        atribuirTarefasMutation,
        atualizarStatusMutation
    }
}