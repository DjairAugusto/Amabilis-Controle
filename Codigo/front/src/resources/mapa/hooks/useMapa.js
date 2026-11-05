import { useQuery } from "@tanstack/react-query";
import { getObrasParaMapa } from "../api/apiMapa";

export const useObrasParaMapa = () => {
    return useQuery({
        queryKey: ['obras-maps'],
        queryFn: getObrasParaMapa,
        staleTime: 0,
        gcTime: 0,
    });
};