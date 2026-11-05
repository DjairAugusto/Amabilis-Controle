import { useContext } from "react";
import { TarefaContext } from "../contexts/TarefaContext";

export const useTarefaContext = () => {
    const context = useContext(TarefaContext);
    if(!context) throw new Error('useTarefaContext deve estar dentro de TarefaProvider');
    return context;
}