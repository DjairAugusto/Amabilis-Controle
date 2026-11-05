import { useContext } from 'react';
import { FornecedorContext } from '../contexts/FornecedorContext';

export const useFornecedorContext = () => {
    const context = useContext(FornecedorContext);
    if (!context) {
        throw new Error('useFornecedorContext deve ser usado dentro de FornecedorProvider');
    }
    return context;
};
