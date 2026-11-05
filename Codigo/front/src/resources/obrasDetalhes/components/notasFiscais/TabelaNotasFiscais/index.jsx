import './TabelaNotasFiscais.css';
import LinhaNotaFiscal from '../LinhaNotaFiscal';
import { useNotasFiscaisContext } from '../../../hooks/useNotasFiscaisContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const OPCOES_TAMANHO_PAGINA = [5, 10, 20];

const TabelaNotasFiscais = ({
  notasFiscais,
  totalElementos,
  quantidadeElementos,
  totalPaginas,
  isLoading,
}) => {
  const { paginaAtual, setPaginaAtual, tamanhoPagina, setTamanhoPagina } =
    useNotasFiscaisContext();

  const handleTrocaTamanhoPagina = (novoTamanho) => {
    setTamanhoPagina(novoTamanho);
    setPaginaAtual(0);
  };

  const handlePaginaAnterior = () => {
    if (paginaAtual > 0) setPaginaAtual(paginaAtual - 1);
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas - 1) setPaginaAtual(paginaAtual + 1);
  };

  const handleIrParaPagina = (pagina) => {
    setPaginaAtual(pagina);
  };

  const gerarPaginas = () => {
    if (totalPaginas <= 1) return [];
    const raio = 2;
    let inicio = Math.max(0, paginaAtual - raio);
    let fim = Math.min(totalPaginas - 1, paginaAtual + raio);
    if (fim - inicio < raio * 2) {
      if (inicio === 0) fim = Math.min(totalPaginas - 1, raio * 2);
      else inicio = Math.max(0, fim - raio * 2);
    }
    const paginas = [];
    for (let i = inicio; i <= fim; i++) paginas.push(i);
    return paginas;
  };

  const paginas = gerarPaginas();

  return (
    <div className="tabela-notas-fiscais">
      <div className="tabela-header">
        <h3>Notas Fiscais</h3>
      </div>

      <table className="tabela">
        <thead>
          <tr>
            <th>NF</th>
            <th>Fornecedor</th>
            <th>Emissão</th>
            <th>Vencimento</th>
            <th>Valor</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#999' }}>
                Carregando notas fiscais...
              </td>
            </tr>
          ) : notasFiscais && notasFiscais.length > 0 ? (
            notasFiscais.map((nf) => (
              <LinhaNotaFiscal key={nf.id} notaFiscal={nf} />
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#999' }}>
                Nenhuma nota fiscal encontrada
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ── Rodapé com paginação ─────────────────────────────────────── */}
      {totalPaginas > 0 && (
        <div className="tabela-paginacao">
          <div className="paginacao-tamanho">
            <span>Por página:</span>
            {OPCOES_TAMANHO_PAGINA.map((opcao) => (
              <button
                key={opcao}
                className={`paginacao-tamanho-btn ${tamanhoPagina === opcao ? 'ativo' : ''}`}
                onClick={() => handleTrocaTamanhoPagina(opcao)}
              >
                {opcao}
              </button>
            ))}
          </div>

          <span className="paginacao-contador">
            Mostrando <strong>{quantidadeElementos}</strong> de{' '}
            <strong>{totalElementos}</strong> nota{totalElementos !== 1 ? 's' : ''}
          </span>

          <div className="paginacao-navegacao">
            <button
              className="paginacao-nav-btn"
              onClick={handlePaginaAnterior}
              disabled={paginaAtual === 0}
              title="Página anterior"
            >
              <ChevronLeft size={16} color="#333" />
            </button>

            {paginas[0] > 0 && (
              <>
                <button className="paginacao-pagina-btn" onClick={() => handleIrParaPagina(0)}>1</button>
                {paginas[0] > 1 && <span className="paginacao-ellipsis">…</span>}
              </>
            )}

            {paginas.map((p) => (
              <button
                key={p}
                className={`paginacao-pagina-btn ${p === paginaAtual ? 'ativo' : ''}`}
                onClick={() => handleIrParaPagina(p)}
              >
                {p + 1}
              </button>
            ))}

            {paginas[paginas.length - 1] < totalPaginas - 1 && (
              <>
                {paginas[paginas.length - 1] < totalPaginas - 2 && (
                  <span className="paginacao-ellipsis">…</span>
                )}
                <button
                  className="paginacao-pagina-btn"
                  onClick={() => handleIrParaPagina(totalPaginas - 1)}
                >
                  {totalPaginas}
                </button>
              </>
            )}

            <button
              className="paginacao-nav-btn"
              onClick={handleProximaPagina}
              disabled={paginaAtual >= totalPaginas - 1}
              title="Próxima página"
            >
              <ChevronRight size={16} color="#333" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabelaNotasFiscais;
