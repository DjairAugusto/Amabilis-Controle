import "./MapaObras.css";
import { useEffect, useRef, useState } from "react";
import { Building2, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BUILDING2_MARKER_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48">
  <ellipse cx="20" cy="45" rx="10" ry="3" fill="rgba(0,0,0,0.2)"/>
  <path d="M20 0 C9 0 0 9 0 20 C0 32 20 48 20 48 C20 48 40 32 40 20 C40 9 31 0 20 0Z"
        fill="#E3B746" stroke="#20242E" stroke-width="2"/>
  <g transform="translate(9, 6) scale(0.916)" stroke="#20242E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" fill="#20242E" stroke="none"/>
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" fill="#20242E" stroke="none"/>
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" fill="#20242E" stroke="none"/>
    <path d="M10 6h4" stroke="#E3B746" stroke-width="1.5"/>
    <path d="M10 10h4" stroke="#E3B746" stroke-width="1.5"/>
    <path d="M10 14h4" stroke="#E3B746" stroke-width="1.5"/>
    <path d="M10 18h4" stroke="#E3B746" stroke-width="1.5"/>
  </g>
</svg>
`)}`;

const BRASIL_CENTER = { lat: -14.235, lng: -51.9253 };
const DEFAULT_ZOOM = 4;

const loadGoogleMapsScript = () => {
    return new Promise((resolve) => {
        if (window.google?.maps) return resolve();
        if (document.querySelector('script[src*="maps.googleapis.com"]')) {
            const interval = setInterval(() => {
                if (window.google?.maps) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
            return;
        }
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
        script.async = true;
        script.onload = resolve;
        document.head.appendChild(script);
    });
};

const criarMarcadores = (mapInstance, obras, onClickObra) => {
    const bounds = new window.google.maps.LatLngBounds();
    const markers = [];

    obras.forEach((obra) => {
        if (!obra.latitude || !obra.longitude) return;

        const position = { lat: obra.latitude, lng: obra.longitude };

        const marker = new window.google.maps.Marker({
            position,
            map: mapInstance,
            title: obra.nomeObra,
            icon: {
                url: BUILDING2_MARKER_URL,
                scaledSize: new window.google.maps.Size(40, 48),
                anchor: new window.google.maps.Point(20, 48),
            }
        });

        marker.addListener('click', () => onClickObra(obra));
        markers.push(marker);
        bounds.extend(position);
    });

    if (markers.length > 1) {
        mapInstance.fitBounds(bounds);
    } else if (markers.length === 1) {
        mapInstance.setCenter(markers[0].getPosition());
        mapInstance.setZoom(14);
    }

    return markers;
};

const MapaObras = ({ obras }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const obrasRef = useRef(obras);
    const [selectedObra, setSelectedObra] = useState(null);
    const [mapaCarregado, setMapaCarregado] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        obrasRef.current = obras;
    }, [obras]);

    useEffect(() => {
        const initMap = async () => {
            await loadGoogleMapsScript();
            if (!mapRef.current) return;

            mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
                center: BRASIL_CENTER,
                zoom: DEFAULT_ZOOM,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                styles: [
                    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
                ]
            });

            setMapaCarregado(true);

            if (obrasRef.current?.length) {
                markersRef.current = criarMarcadores(mapInstanceRef.current, obrasRef.current, setSelectedObra);
            }
        };

        initMap();
    }, []);

    useEffect(() => {
        if (!mapaCarregado || !mapInstanceRef.current || !obras?.length) return;

        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = criarMarcadores(mapInstanceRef.current, obras, setSelectedObra);
    }, [mapaCarregado, obras]);

    return (
        <div className="mapa-obras-wrapper">
            <div ref={mapRef} className="mapa-obras-container" />

            {selectedObra && (
                <div className="mapa-obras-popup">
                    <button className="mapa-obras-popup-fechar" onClick={() => setSelectedObra(null)}>✕</button>
                    <div className="mapa-obras-popup-header">
                        <Building2 size={18} color="#E3B746" />
                        <h3>{selectedObra.nomeObra}</h3>
                    </div>
                    <p className="mapa-obras-popup-endereco">{selectedObra.endereco}</p>
                    <div className="mapa-obras-popup-info">
                        <span className="mapa-obras-status">{selectedObra.statusObra}</span>
                        <button
                            className="mapa-obras-popup-link"
                            onClick={() => navigate(`/obras/${selectedObra.id}`)}
                        >
                            Ver obra <ArrowUpRight size={14} />
                        </button>
                    </div>
                </div>
            )}

            {!mapaCarregado && (
                <div className="mapa-obras-loading">
                    <p>Carregando mapa...</p>
                </div>
            )}
        </div>
    );
};

export default MapaObras;