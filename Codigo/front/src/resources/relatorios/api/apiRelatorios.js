import api from '../../../services/api';

export const getRelatoriosListaObras = async () => {
  try {
    const response = await api.get('/obra');
    return response.data || [];
  } catch (error) {
    console.error('Erro ao buscar obras:', error);
    return [];
  }
};

export const getRelatorioCustos = async (obraId, params = {}) => {
  try {
    const response = await api.get(`/obra/${obraId}/relatorio/custos`, { params });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar relatório de custos:`, error);
    throw error;
  }
};

export const getRelatorioPagamentos = async (obraId, params = {}) => {
  try {
    const response = await api.get(`/obra/${obraId}/relatorio/pagamentos`, { params });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar relatório de pagamentos:`, error);
    throw error;
  }
};

export const downloadRelatorioCustosExcel = async (obraId) => {
  try {
    console.log(`Baixando relatório de custos (Excel) para obra ${obraId}...`);
    const response = await api.get(`/obra/${obraId}/relatorio/custos/excel`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio-custos-${obraId}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    console.log('Arquivo baixado com sucesso');
  } catch (error) {
    console.error('Erro ao baixar relatório de custos:', error);
    throw error;
  }
};

export const downloadRelatorioPagamentosExcel = async (obraId) => {
  try {
    console.log(`Baixando relatório de pagamentos (Excel) para obra ${obraId}...`);
    const response = await api.get(`/obra/${obraId}/relatorio/pagamentos/excel`, {
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio-pagamentos-${obraId}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    console.log('Arquivo baixado com sucesso');
  } catch (error) {
    console.error('Erro ao baixar relatório de pagamentos:', error);
    throw error;
  }
};
