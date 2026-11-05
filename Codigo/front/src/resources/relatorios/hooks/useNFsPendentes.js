import { useQuery } from '@tanstack/react-query';
import { getNFsPendentes } from '../api/apiNFPendentes';

export const useNFsPendentes = (obraId, params = {}) => {
  const token = sessionStorage.getItem('@Amabilis:token');

  return useQuery({
    queryKey: ['nfs-pendentes', obraId, params],
    queryFn: () => getNFsPendentes(obraId, params),
    enabled: !!token && !!obraId,
    staleTime: 1000 * 60 * 5,
  });
};
