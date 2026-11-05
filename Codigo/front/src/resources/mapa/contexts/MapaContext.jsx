import { createContext, useState } from "react";

export const MapaContext = createContext();

export const MapaProvider = ({ children }) => {
    const [searchNome, setSearchNome] = useState('');
    const [searchEndereco, setSearchEndereco] = useState('');

    return (
        <MapaContext.Provider value={{ searchNome, setSearchNome, searchEndereco, setSearchEndereco }}>
            {children}
        </MapaContext.Provider>
    );
};