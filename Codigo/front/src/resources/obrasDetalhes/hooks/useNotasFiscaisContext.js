import { useContext } from "react";
import { ObrasNotasFiscaisContext } from "../contexts/ObrasNotasFiscaisContext";

export const useNotasFiscaisContext = () => {
    const context = useContext(ObrasNotasFiscaisContext);
    if(!context) throw new Error('useObrasDetalhesContext deve estar dentro de ObrasDetalhesProvider');
    return context;
}