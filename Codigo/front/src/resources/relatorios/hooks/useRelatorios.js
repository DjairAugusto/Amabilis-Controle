import { useQuery } from '@tanstack/react-query';
import { getRelatorios } from '../api/apiRelatorios';

export const useRelatorios = () => {
  return useQuery({
    queryKey: ['relatorios'],
    queryFn: getRelatorios,
    staleTime: 1000 * 60 * 10
  });
};
