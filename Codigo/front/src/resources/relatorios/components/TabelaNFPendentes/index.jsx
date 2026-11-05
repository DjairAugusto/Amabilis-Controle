import './TabelaNFPendentes.css';
import { useRelatoriosContext } from '../../hooks/useRelatoriosContext';
import PaginacaoRelatorios from '../PaginacaoRelatorios';

const formatarMoeda = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor ?? 0);

const formatarData = (data) => {
  if (!data) return '-';
  return new Date(data + 'T00:00:00').toLocaleDateString('pt-BR');
};

const LABEL_STATUS = {
  VENCIDA:           { label: 'Vencida',          classe: 'status-vencida' },
  PENDENTE:          { label: 'Pendente',          classe: 'status-pendente' },
  PAGA_PARCIALMENTE: { label: 'Paga parcialmente', classe: 'status-parcial' },
};

const TabelaNFPendentes = ({ dados, isLoading = false }) => {
  const { paginaAtual, tamanhoPagina, setPaginaAtual, setTamanhoPagina } = useRelatoriosContext();

  const linhas = dados?.conteudo || [];
  const totalRegistros = dados?.totalElementos || 0;
  const totalPaginas = dados?.totalPaginas || 0;

  if (isLoading) {
    return (
      <div className="nfp-loading-container">
        <div className="nfp-spinner" />
        <p>Carregando notas fiscais pendentes...</p>
      </div>
    );
  }

  return (
    <div className="nfp-container">
      <div className="nfp-tabela-wrapper">
        <table className="nfp-tabela">
          <thead>
            <tr>
              <th>Nº Nota Fiscal</th>
              <th>Fornecedor</th>
              <th>Data de Emissão</th>
              <th>Data de Vencimento</th>
              <th>Valor Restante</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {linhas.length > 0 ? (
              linhas.map((nf) => {
                const statusInfo = LABEL_STATUS[nf.status] ?? { label: nf.status, classe: '' };
                return (
                  <tr key={nf.id}>
                    <td>{nf.numeroDocumento || '-'}</td>
                    <td>{nf.fornecedor || '-'}</td>
                    <td>{formatarData(nf.dataEmissao)}</td>
                    <td>{formatarData(nf.dataVencimento)}</td>
                    <td className="nfp-valor">{formatarMoeda(nf.valorRestante)}</td>
                    <td>
                      <span className={`nfp-status-badge ${statusInfo.classe}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="nfp-vazio">
                  Nenhuma nota fiscal pendente encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalRegistros > 0 && (
        <PaginacaoRelatorios
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          tamanhoPagina={tamanhoPagina}
          totalRegistros={totalRegistros}
          onPaginaChange={setPaginaAtual}
          onTamanhoPaginaChange={setTamanhoPagina}
        />
      )}
    </div>
  );
};

export default TabelaNFPendentes;
