import { useQuery } from "@tanstack/react-query"
import { getEstatisticasObra, getEvolucaoMensal, getGraficoFornecedores, getGraficoRecursos, getResumoDashboard } from "../api/apiDashboard"

export const useDashboardResumo = () => {
    return useQuery({
        queryKey: ['dashboard-resumo'],
        queryFn: getResumoDashboard,
        staleTime: 1000 * 60 * 10
    })
}

export const useEvolucaoMensal = ({ dataInicio, dataFim } = {}) => {
    return useQuery({
        queryKey: ['dashboard-evolucao-mensal', dataInicio || null, dataFim || null],
        queryFn: () => getEvolucaoMensal(dataInicio, dataFim),
        staleTime: 1000 * 60 * 10
    })
}

export const useGraficoFornecedores = () => {
    return useQuery({
        queryKey: ['dashboard-grafico-fornecedores'],
        queryFn: getGraficoFornecedores,
        staleTime: 1000 * 60 * 10
    })
}

export const useGraficoRecursos = () => {
    return useQuery({
        queryKey: ['dashboard-grafico-recursos'],
        queryFn: getGraficoRecursos,
        staleTime: 1000 * 60 * 10
    })
}

export const useEstatisticasObra = (id) => {
    return useQuery({
        queryKey: ['dashboard-stats-obra', id || null],
        queryFn: () => getEstatisticasObra(id),
        enabled: !!id,
        staleTime: 1000 * 60 * 10
    })
}