import './TabelaSaida.css';
import { useRelatoriosContext } from '../../hooks/useRelatoriosContext';
import PaginacaoRelatorios from '../PaginacaoRelatorios';

const TabelaSaida = ({ dados, isLoading = false }) => {
  const { paginaAtual, tamanhoPagina, setPaginaAtual, setTamanhoPagina } = useRelatoriosContext();

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor || 0);
  };

  const formatarData = (data) => {
    if (!data) return '-';
    const d = new Date(data + 'T00:00:00');
    return d.toLocaleDateString('pt-BR');
  };

  const linhas = dados?.conteudo || [];
  const totalRegistros = dados?.totalElementos || 0;
  const totalPaginas = dados?.totalPaginas || 0;

  if (isLoading) {
    return (
      <div className="tabela-container tabela-loading-container">
        <div className="tabela-loading">
          <div className="spinner"></div>
          <p>Carregando relatório...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tabela-saida">
      <table className="tabela">
        <thead>
          <tr>
            <th>Documento</th>
            <th>Emissão</th>
            <th>Vencimento</th>
            <th>Pagamento</th>
            <th>Valor Pago</th>
          </tr>
        </thead>
        <tbody>
          {linhas && linhas.length > 0 ? (
            linhas.map((item) => (
              <tr key={item.id}>
                <td>{item.numeroDocumento || '-'}</td>
                <td>{formatarData(item.emissao)}</td>
                <td>{formatarData(item.vencimento)}</td>
                <td>{formatarData(item.pagto)}</td>
                <td>{formatarMoeda(item.valorPago)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                Nenhum dado disponível
              </td>
            </tr>
          )}
        </tbody>
      </table>

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

export default TabelaSaida;
