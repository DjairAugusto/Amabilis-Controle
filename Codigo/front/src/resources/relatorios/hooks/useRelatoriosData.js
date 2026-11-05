import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getRelatoriosListaObras,
  getRelatorioCustos,
  getRelatorioPagamentos,
  downloadRelatorioCustosExcel,
  downloadRelatorioPagamentosExcel
} from '../api/apiRelatorios';

export const useRelatoriosListaObras = () => {
  return useQuery({
    queryKey: ['relatorios-obras'],
    queryFn: getRelatoriosListaObras,
    staleTime: 1000 * 60 * 10
  });
};

export const useRelatorioCustos = (obraId, params = {}) => {
  return useQuery({
    queryKey: ['relatorio-custos', obraId, params],
    queryFn: () => getRelatorioCustos(obraId, params),
    enabled: !!obraId,
    staleTime: 1000 * 60 * 10
  });
};

export const useRelatorioPagamentos = (obraId, params = {}) => {
  return useQuery({
    queryKey: ['relatorio-pagamentos', obraId, params],
    queryFn: () => getRelatorioPagamentos(obraId, params),
    enabled: !!obraId,
    staleTime: 1000 * 60 * 10
  });
};

export const useDownloadRelatorioCustosExcel = () => {
  return useMutation({
    mutationFn: downloadRelatorioCustosExcel,
    onError: (error) => {
      console.error('Erro ao baixar relatório de custos:', error);
    }
  });
};

export const useDownloadRelatorioPagamentosExcel = () => {
  return useMutation({
    mutationFn: downloadRelatorioPagamentosExcel,
    onError: (error) => {
      console.error('Erro ao baixar relatório de pagamentos:', error);
    }
  });
};
