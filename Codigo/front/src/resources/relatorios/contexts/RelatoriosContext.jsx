import { createContext, useState } from 'react';

export const RelatoriosContext = createContext();

export const RelatoriosProvider = ({ children }) => {
  const [abaAtiva, setAbaAtiva] = useState('custoObra');
  const [obraSelecionada, setObraSelecionada] = useState(null);

  // Filtros
  const [dataEmissaoInicio, setDataEmissaoInicio] = useState('');
  const [dataEmissaoFim, setDataEmissaoFim] = useState('');
  const [dataEmissao, setDataEmissao] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [codigoNf, setCodigoNf] = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [status, setStatus] = useState('');
  const [codigoTarefa, setCodigoTarefa] = useState('');
  const [codigoRecurso, setCodigoRecurso] = useState('');

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [tamanhoPagina, setTamanhoPagina] = useState(10);
  const [ordenarPor, setOrdenarPor] = useState('emissao');
  const [direcao, setDirecao] = useState('DESC');

  const limparFiltros = () => {
    setDataEmissaoInicio('');
    setDataEmissaoFim('');
    setDataEmissao('');
    setDataVencimento('');
    setCodigoNf('');
    setFornecedorId('');
    setStatus('');
    setCodigoTarefa('');
    setCodigoRecurso('');
    setPaginaAtual(0);
  };

  const mudarAba = (novaAba) => {
    setAbaAtiva(novaAba);
    limparFiltros();
  };

  return (
    <RelatoriosContext.Provider
      value={{
        abaAtiva,
        setAbaAtiva,
        mudarAba,
        obraSelecionada,
        setObraSelecionada,
        dataEmissaoInicio,
        setDataEmissaoInicio,
        dataEmissaoFim,
        setDataEmissaoFim,
        dataEmissao,
        setDataEmissao,
        dataVencimento,
        setDataVencimento,
        codigoNf,
        setCodigoNf,
        fornecedorId,
        setFornecedorId,
        status,
        setStatus,
        codigoTarefa,
        setCodigoTarefa,
        codigoRecurso,
        setCodigoRecurso,
        paginaAtual,
        setPaginaAtual,
        tamanhoPagina,
        setTamanhoPagina,
        ordenarPor,
        setOrdenarPor,
        direcao,
        setDirecao,
        limparFiltros,
      }}
    >
      {children}
    </RelatoriosContext.Provider>
  );
};
