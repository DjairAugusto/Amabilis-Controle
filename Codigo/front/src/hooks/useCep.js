import { useEffect, useState } from 'react';
import { fetchCep } from '../services/apiCep';

export const useCep = (cep, onCepFound) => {
    const [isLoadingCep, setIsLoadingCep] = useState(false);
    const [erroCep, setErroCep] = useState(null);

    useEffect(() => {
        const cepSeguro = String(cep || '');
        const cepLimpo = cepSeguro.replace(/\D/g, '');

        if (cepLimpo.length === 8) {
            setIsLoadingCep(true);
            setErroCep(null);

            fetchCep(cepLimpo)
                .then((data) => {
                    if (onCepFound) onCepFound(data);
                })
                .catch((err) => {
                    setErroCep(err.message);
                })
                .finally(() => {
                    setIsLoadingCep(false);
                });
        }
    }, [cep]); 

    return { isLoadingCep, erroCep };
};