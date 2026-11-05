import "./Mapa.css";
import { MapaProvider } from "../../resources/mapa/contexts/MapaContext";
import { useMapaContext } from "../../resources/mapa/hooks/useMapaContext";
import { useObrasParaMapa } from "../../resources/mapa/hooks/useMapa";
import { filtrarObrasParaMapa } from "../../resources/mapa/utils/mapaFilters";
import MapaHeader from "../../resources/mapa/components/MapaHeader";
import MapaObras from "../../resources/mapa/components/MapaObras";

const MapaContent = () => {
  const { searchNome, searchEndereco } = useMapaContext();
  const { data: obras, isLoading, error } = useObrasParaMapa();
  const obrasFiltradas = filtrarObrasParaMapa(
    obras || [],
    searchNome,
    searchEndereco,
  );

  return (
    <section className="mapa-section">
      <MapaHeader />
      {isLoading ? (
        <p>Carregando obras...</p>
      ) : error ? (
        <p>Erro ao carregar obras: {error.message}</p>
      ) : (
        <MapaObras obras={obrasFiltradas} />
      )}
    </section>
  );
};

const Mapa = () => {
  return (
    <MapaProvider>
      <MapaContent />
    </MapaProvider>
  );
};

export default Mapa;
