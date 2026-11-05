// Helper para normalizar data no formato YYYY-MM-DD
const normalizarData = (data) => {
  if (!data) return null;
  if (typeof data !== 'string') return null;

  // Se já está no formato YYYY-MM-DD, retorna
  if (data.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return data;
  }

  // Se tem T (ISO format), pega só a parte da data
  if (data.includes('T')) {
    return data.split('T')[0];
  }

  return data;
};

export const aplicarFiltrosRelatorio = (dados, filtros) => {
  if (!dados || dados.length === 0) return [];

  return dados.filter(item => {
    // Filtro por Data de Emissão
    if (filtros.dataEmissao && filtros.dataEmissao.trim()) {
      const emissaoItem = normalizarData(item.emissao);
      if (emissaoItem !== filtros.dataEmissao) return false;
    }

    // Filtro por Data de Vencimento
    if (filtros.dataVencimento && filtros.dataVencimento.trim()) {
      const vencimentoItem = normalizarData(item.vencimento);
      if (vencimentoItem !== filtros.dataVencimento) return false;
    }

    // Filtro por Período (Data Início e Fim)
    if (filtros.dataInicio || filtros.dataFim) {
      const emissaoItem = normalizarData(item.emissao);
      if (!emissaoItem) return false;

      const dataItem = new Date(emissaoItem + 'T00:00:00');

      if (filtros.dataInicio) {
        const inicio = new Date(filtros.dataInicio + 'T00:00:00');
        if (dataItem < inicio) return false;
      }

      if (filtros.dataFim) {
        const fim = new Date(filtros.dataFim + 'T23:59:59');
        if (dataItem > fim) return false;
      }
    }

    // Filtro por Número NF / Documento
    if (filtros.numeroNF && filtros.numeroNF.trim()) {
      const nfBusca = filtros.numeroNF.toLowerCase().trim();
      // Tenta vários nomes de campos possíveis
      const nfItem = (item.documento || item.numeroNF || item.numeroDocumento || '').toString().toLowerCase();
      if (!nfItem.includes(nfBusca)) return false;
    }

    // Filtro por Fornecedor
    if (filtros.fornecedorSelecionado && filtros.fornecedorSelecionado.trim()) {
      const fornecedor = (item.fornecedor || '').toString().toLowerCase();
      if (!fornecedor.includes(filtros.fornecedorSelecionado.toLowerCase())) return false;
    }

    // Filtro por Código Tarefa
    if (filtros.codigoTarefa && filtros.codigoTarefa.trim()) {
      const tarefaBusca = filtros.codigoTarefa.toLowerCase().trim();
      const tarefaItem = (item.codTarefa || '').toString().toLowerCase();
      if (!tarefaItem.includes(tarefaBusca)) return false;
    }

    // Filtro por Código Recurso
    if (filtros.codigoRecurso && filtros.codigoRecurso.trim()) {
      const recursoBusca = filtros.codigoRecurso.toLowerCase().trim();
      const recursoItem = (item.codRecurso || '').toString().toLowerCase();
      if (!recursoItem.includes(recursoBusca)) return false;
    }

    return true;
  });
};
