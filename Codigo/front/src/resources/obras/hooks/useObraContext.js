import { useContext } from "react";
import { ObraContext } from "../contexts/ObraContext";

export const useObraContext = () => {
    const context = useContext(ObraContext);
    if(!context) throw new Error('useObraContext deve estar dentro de ObraProvider');
    return context;
}