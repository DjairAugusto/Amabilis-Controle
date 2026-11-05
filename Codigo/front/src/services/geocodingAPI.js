const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// 1. Função auxiliar para garantir que o motor do Google está carregado no navegador
const loadGoogleMapsScript = () => {
    return new Promise((resolve, reject) => {
        // Se já estiver carregado, segue direto
        if (window.google?.maps) return resolve();
        
        // Se já estiver no HTML mas carregando, espera um pouquinho
        if (document.querySelector('script[src*="maps.googleapis.com"]')) {
            const interval = setInterval(() => {
                if (window.google?.maps) {
                    clearInterval(interval);
                    resolve();
                }
            }, 100);
            return;
        }
        
        // Se não existir, cria a injeção do script usando a sua chave
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

// 2. A sua função principal (agora usando a biblioteca JS do Google em vez do Axios)
export const obterCoordenadasPorEndereco = async (enderecoCompleto) => {
    if (!enderecoCompleto) return null;

    try {
        // Garante que o Google Maps está pronto para uso
        await loadGoogleMapsScript();
        
        // Instancia o Geocoder do motor do Google
        const geocoder = new window.google.maps.Geocoder();

        // Envolve a chamada numa Promise para podermos usar o async/await no seu Modal
        return new Promise((resolve) => {
            geocoder.geocode({ address: enderecoCompleto, region: 'BR' }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const location = results[0].geometry.location;
                    
                    resolve({
                        // O motor JS retorna as coordenadas como funções ()
                        lat: location.lat(), 
                        lng: location.lng()  
                    });
                } else {
                    console.warn('Aviso: O Google Maps não conseguiu mapear este endereço.', status);
                    resolve(null);
                }
            });
        });
    } catch (error) {
        console.error('Erro ao instanciar o Geocoder do Google Maps:', error);
        return null;
    }
};