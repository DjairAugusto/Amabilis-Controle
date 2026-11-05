import { createContext, useState } from "react";

export const ObraContext = createContext();

export const ObraProvider = ({ children }) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [tamanhoPagina, setTamanhoPagina] = useState(9);

    return (
        <ObraContext.Provider value={{
            searchTerm, setSearchTerm,
            paginaAtual, setPaginaAtual,
            tamanhoPagina, setTamanhoPagina
        }}>
            {children}
        </ObraContext.Provider>
    )

}