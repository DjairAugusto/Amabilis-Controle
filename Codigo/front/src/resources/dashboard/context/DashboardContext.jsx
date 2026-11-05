import { createContext, useState } from "react";
// Importe os hooks reais conforme a sua estrutura de pastas
import { useDashboardResumo, useEvolucaoMensal, useEstatisticasObra, useGraficoFornecedores, useGraficoRecursos } from '../hooks/useDashboard';
import { dashboardResumoMock } from "../../../mock/dashboardResumomock";
import { evolucaoMensalMock } from "../../../mock/evolucaoMensalMock";

const mapGraficoParaRecursos = (grafico) => {
    if (!grafico?.labels || !grafico?.data) {
        return [];
    }

    return grafico.labels.map((label, index) => ({
        name: label,
        value: Number(grafico.data[index] ?? 0)
    }));
};

const mapGraficoParaFornecedores = (grafico) => {
    if (!grafico?.labels || !grafico?.data) {
        return [];
    }

    return grafico.labels.map((label, index) => ({
        nomeFornecedor: label,
        numeroNFs: Number(grafico.data[index] ?? 0)
    }));
};

export const DashboardContext = createContext();

export const DashboardProvider = ({children}) => {
    // Lógica de Datas Mantida
    const today = new Date();
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [dateFrom, setDateFrom] = useState(formatDate(sixMonthsAgo));
    const [dateTo, setDateTo] = useState(formatDate(today));

    const resetPeriod = () => {
        setDateFrom(formatDate(sixMonthsAgo));
        setDateTo(formatDate(today));
    };

    // Nova Lógica de Filtro por Obra
    const [obraSelecionadaId, setObraSelecionadaId] = useState(null);

    const { data: geralResumo, isLoading: loadingResumoGeral } = useDashboardResumo();
    const { data: geralRecursos, isLoading: loadingRecursosGeral } = useGraficoRecursos();
    const { data: geralFornecedores, isLoading: loadingFornecedoresGeral } = useGraficoFornecedores();
    const { data: geralEvolucao, isLoading: loadingEvolucaoGeral } = useEvolucaoMensal({ dataInicio: dateFrom, dataFim: dateTo });
    const { data: obraData, isLoading: loadingObra } = useEstatisticasObra(obraSelecionadaId);

    const dadosResumo = obraSelecionadaId ? obraData : (geralResumo || dashboardResumoMock);
    const dadosRecursos = obraSelecionadaId ? obraData?.custoRecursos : mapGraficoParaRecursos(geralRecursos);
    const dadosFornecedores = obraSelecionadaId ? obraData?.fornecedorNFChart : mapGraficoParaFornecedores(geralFornecedores);
    const dadosEvolucao = obraSelecionadaId ? obraData?.evolucaoMensal : (geralEvolucao || evolucaoMensalMock);

    const isLoadingResumo = obraSelecionadaId ? loadingObra : loadingResumoGeral;
    const isLoadingRecursos = obraSelecionadaId ? loadingObra : loadingRecursosGeral;
    const isLoadingFornecedores = obraSelecionadaId ? loadingObra : loadingFornecedoresGeral;
    const isLoadingEvolucao = obraSelecionadaId ? loadingObra : loadingEvolucaoGeral;

    return (
        <DashboardContext.Provider value={{
            dateFrom,
            setDateFrom,
            dateTo,
            setDateTo,
            resetPeriod,
            obraSelecionadaId,
            setObraSelecionadaId,
            dadosResumo,
            dadosRecursos,
            dadosFornecedores,
            dadosEvolucao,
            isLoadingEvolucao,
            isLoadingFornecedores,
            isLoadingRecursos,
            isLoadingResumo
        }}>
            {children}
        </DashboardContext.Provider>
    )
}