import { useContext } from "react";
import { RecursoContext } from "../contexts/RecursoContext";

export const useRecursoContext = () => {
    const context = useContext(RecursoContext);
    if(!context) throw new Error('useRecursoContext deve estar dentro de RecursoProvider');
    return context;
}