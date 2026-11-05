import './PaginacaoPagamentos.css';
import { usePagamentoContext } from '../../hooks/usePagamentoContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const OPCOES_TAMANHO_PAGINA = [5, 10, 20];

const PaginacaoPagamentos = ({ totalElementos, quantidadeElementos, totalPaginas }) => {
  const { paginaAtual, setPaginaAtual, tamanhoPagina, setTamanhoPagina } = usePagamentoContext();

  if (totalPaginas <= 0) return null;

  const handleTrocaTamanhoPagina = (novoTamanho) => {
    setTamanhoPagina(novoTamanho);
    setPaginaAtual(0);
  };

  const handlePaginaAnterior = () => { if (paginaAtual > 0) setPaginaAtual(paginaAtual - 1); };
  const handleProximaPagina = () => { if (paginaAtual < totalPaginas - 1) setPaginaAtual(paginaAtual + 1); };
  const handleIrParaPagina = (pagina) => { setPaginaAtual(pagina); };

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
    <div className="tabela-paginacao" style={{ marginTop: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
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
        <strong>{totalElementos}</strong> notas
      </span>

      <div className="paginacao-navegacao">
        <button className="paginacao-nav-btn" onClick={handlePaginaAnterior} disabled={paginaAtual === 0} >
          <ChevronLeft size={16} color="#333" />
        </button>

        {paginas[0] > 0 && (
          <>
            <button className="paginacao-pagina-btn" onClick={() => handleIrParaPagina(0)}>1</button>
            {paginas[0] > 1 && <span className="paginacao-ellipsis">…</span>}
          </>
        )}

        {paginas.map((p) => (
          <button key={p} className={`paginacao-pagina-btn ${p === paginaAtual ? 'ativo' : ''}`} onClick={() => handleIrParaPagina(p)}>
            {p + 1}
          </button>
        ))}

        {paginas[paginas.length - 1] < totalPaginas - 1 && (
          <>
            {paginas[paginas.length - 1] < totalPaginas - 2 && <span className="paginacao-ellipsis">…</span>}
            <button className="paginacao-pagina-btn" onClick={() => handleIrParaPagina(totalPaginas - 1)}>
              {totalPaginas}
            </button>
          </>
        )}

        <button className="paginacao-nav-btn" onClick={handleProximaPagina} disabled={paginaAtual >= totalPaginas - 1} >
          <ChevronRight size={16} color="#333" />
        </button>
      </div>
    </div>
  );
};

export default PaginacaoPagamentos;