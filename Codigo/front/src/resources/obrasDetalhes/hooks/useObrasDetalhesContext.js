import { useContext } from "react";
import { ObrasDetalhesContext } from "../contexts/ObrasDetalhesContext";

export const useObrasDetalhesContext = () => {
    const context = useContext(ObrasDetalhesContext);
    if(!context) throw new Error('useObrasDetalhesContext deve estar dentro de ObrasDetalhesProvider');
    return context;
}