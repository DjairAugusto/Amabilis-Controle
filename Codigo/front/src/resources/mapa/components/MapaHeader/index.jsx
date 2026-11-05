import "./MapaHeader.css";
import SearchBar from "../../../../components/ui/SearchBar";
import { useMapaContext } from "../../hooks/useMapaContext";

const MapaHeader = () => {
    const { searchNome, setSearchNome, searchEndereco, setSearchEndereco } = useMapaContext();

    return (
        <div className="mapa-header">
            <div className="mapa-header-texto">
                <h1 className="mapa-titulo">Mapa de Obras</h1>
                <p className="mapa-subtitulo">Visualização geográfica das obras</p>
            </div>
            <div className="mapa-header-filtros">
                <SearchBar
                    placeholder="Buscar por nome da obra"
                    value={searchNome}
                    onChange={(e) => setSearchNome(e.target.value)}
                />
                <SearchBar
                    placeholder="Buscar por endereço"
                    value={searchEndereco}
                    onChange={(e) => setSearchEndereco(e.target.value)}
                />
            </div>
        </div>
    );
};

export default MapaHeader;