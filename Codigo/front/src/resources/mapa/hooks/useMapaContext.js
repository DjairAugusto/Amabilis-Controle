import { useContext } from "react";
import { MapaContext } from "../contexts/MapaContext";

export const useMapaContext = () => {
    const context = useContext(MapaContext);
    if (!context) throw new Error('useMapaContext deve estar dentro de MapaProvider');
    return context;
};