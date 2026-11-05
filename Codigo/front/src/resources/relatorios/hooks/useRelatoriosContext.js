import { useContext } from 'react';
import { RelatoriosContext } from '../contexts/RelatoriosContext';

export const useRelatoriosContext = () => {
  const context = useContext(RelatoriosContext);
  if (!context) {
    throw new Error('useRelatoriosContext deve ser usado dentro de RelatoriosProvider');
  }
  return context;
};
