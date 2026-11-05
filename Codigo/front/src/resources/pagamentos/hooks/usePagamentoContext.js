import { useContext } from "react"
import { PagamentoContext } from "../contexts/PagamentoContext"

export const usePagamentoContext = () => {
    const context = useContext(PagamentoContext);
    if(!context) throw new Error('usePagamentoContext deve estar dentro de PagamentoProvider');
    return context;
}