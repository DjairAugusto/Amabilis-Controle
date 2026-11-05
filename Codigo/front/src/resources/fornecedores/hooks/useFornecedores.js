import { useQuery } from "@tanstack/react-query"
import { getFornecedores } from "../api/apiFornecedores"

export const useFornecedores = () => {
    return useQuery({
        queryKey: ['fornecedores'],
        queryFn: getFornecedores,
        staleTime: 1000 * 60 * 10
    })
}
