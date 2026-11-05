import './Relatorios.css';
import { useMemo, useState, useEffect } from 'react';
import RelatoriosHeader from '../../resources/relatorios/components/RelatoriosHeader';
import TabelaCustoObra from '../../resources/relatorios/components/TabelaCustoObra';
import TabelaSaida from '../../resources/relatorios/components/TabelaSaida';
import TabelaNFPendentes from '../../resources/relatorios/components/TabelaNFPendentes';
import { RelatoriosProvider } from '../../resources/relatorios/contexts/RelatoriosContext';
import { useRelatoriosContext } from '../../resources/relatorios/hooks/useRelatoriosContext';
import { useRelatorioCustos, useRelatorioPagamentos } from '../../resources/relatorios/hooks/useRelatoriosData';
import { useNFsPendentes } from '../../resources/relatorios/hooks/useNFsPendentes';

const RelatoriosContent = () => {
  const {
    abaAtiva,
    obraSelecionada,
    dataEmissaoInicio,
    dataEmissaoFim,
    dataEmissao,
    dataVencimento,
    codigoNf,
    fornecedorId,
    status,
    codigoTarefa,
    codigoRecurso,
    paginaAtual,
    tamanhoPagina,
    ordenarPor,
    direcao,
  } = useRelatoriosContext();

  // Estado para filtros com debounce
  const [filtrosDebounced, setFiltrosDebounced] = useState({
    dataEmissaoInicio: '',
    dataEmissaoFim: '',
    dataEmissao: '',
    dataVencimento: '',
    codigoNf: '',
    fornecedorId: '',
    status: '',
    codigoTarefa: '',
    codigoRecurso: '',
  });

  // Debounce de 1,5 segundos para filtros
  useEffect(() => {
    const timer = setTimeout(() => {
      setFiltrosDebounced({
        dataEmissaoInicio,
        dataEmissaoFim,
        dataEmissao,
        dataVencimento,
        codigoNf,
        fornecedorId,
        status,
        codigoTarefa,
        codigoRecurso,
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [dataEmissaoInicio, dataEmissaoFim, dataEmissao, dataVencimento, codigoNf, fornecedorId, status, codigoTarefa, codigoRecurso]);

  // Construir parâmetros para custos (usa filtros com debounce)
  const paramsCustos = useMemo(() => {
    const params = {
      pagina: paginaAtual,
      tamanhoPagina,
      ordenarPor: ordenarPor || 'emissao',
      direcao: direcao || 'DESC',
    };

    if (filtrosDebounced.dataEmissaoInicio) params.dataEmissaoInicio = filtrosDebounced.dataEmissaoInicio;
    if (filtrosDebounced.dataEmissaoFim) params.dataEmissaoFim = filtrosDebounced.dataEmissaoFim;
    if (filtrosDebounced.dataEmissao) params.dataEmissao = filtrosDebounced.dataEmissao;
    if (filtrosDebounced.dataVencimento) params.dataVencimento = filtrosDebounced.dataVencimento;
    if (filtrosDebounced.codigoNf) params.codigoNf = filtrosDebounced.codigoNf;
    if (filtrosDebounced.fornecedorId) params.fornecedorId = filtrosDebounced.fornecedorId;
    if (filtrosDebounced.codigoTarefa) params.codigoTarefa = filtrosDebounced.codigoTarefa;
    if (filtrosDebounced.codigoRecurso) params.codigoRecurso = filtrosDebounced.codigoRecurso;

    return params;
  }, [paginaAtual, tamanhoPagina, ordenarPor, direcao, filtrosDebounced]);

  // Construir parâmetros para pagamentos (usa filtros com debounce)
  const paramsPagamentos = useMemo(() => {
    const params = {
      pagina: paginaAtual,
      tamanhoPagina,
      ordenarPor: ordenarPor || 'dataPagamento',
      direcao: direcao || 'DESC',
    };

    if (filtrosDebounced.dataEmissaoInicio) params.dataEmissaoInicio = filtrosDebounced.dataEmissaoInicio;
    if (filtrosDebounced.dataEmissaoFim) params.dataEmissaoFim = filtrosDebounced.dataEmissaoFim;
    if (filtrosDebounced.dataEmissao) params.dataEmissao = filtrosDebounced.dataEmissao;
    if (filtrosDebounced.dataVencimento) params.dataVencimento = filtrosDebounced.dataVencimento;
    if (filtrosDebounced.codigoNf) params.codigoNf = filtrosDebounced.codigoNf;

    return params;
  }, [paginaAtual, tamanhoPagina, ordenarPor, direcao, filtrosDebounced]);

  // Construir parâmetros para NFs Pendentes (usa filtros com debounce)
  const paramsNFPendentes = useMemo(() => {
    const params = {
      pagina: paginaAtual,
      tamanhoPagina,
      ordenarPor: ordenarPor || 'emissao',
      direcao: direcao || 'DESC',
    };

    if (filtrosDebounced.dataEmissaoInicio) params.dataEmissaoInicio = filtrosDebounced.dataEmissaoInicio;
    if (filtrosDebounced.dataEmissaoFim) params.dataEmissaoFim = filtrosDebounced.dataEmissaoFim;
    if (filtrosDebounced.dataEmissao) params.dataEmissao = filtrosDebounced.dataEmissao;
    if (filtrosDebounced.dataVencimento) params.dataVencimento = filtrosDebounced.dataVencimento;
    if (filtrosDebounced.codigoNf) params.codigoNf = filtrosDebounced.codigoNf;
    if (filtrosDebounced.fornecedorId) params.fornecedorId = filtrosDebounced.fornecedorId;
    if (filtrosDebounced.status) params.status = filtrosDebounced.status;

    return params;
  }, [paginaAtual, tamanhoPagina, ordenarPor, direcao, filtrosDebounced]);

  const { data: relatorioCustos, isLoading: carregandoCustos, error: erroCustos } = useRelatorioCustos(
    obraSelecionada?.id,
    abaAtiva === 'custoObra' ? paramsCustos : {}
  );

  const { data: relatorioPagamentos, isLoading: carregandoPagamentos, error: erroPagamentos } = useRelatorioPagamentos(
    obraSelecionada?.id,
    abaAtiva === 'pagamentos' ? paramsPagamentos : {}
  );

  const { data: nfsPendentes, isLoading: carregandoNFs, error: erroNFs } = useNFsPendentes(
    obraSelecionada?.id,
    abaAtiva === 'nfPendentes' ? paramsNFPendentes : {}
  );

  const error = erroCustos || erroPagamentos || erroNFs;

  if (error) return <p>Erro ao carregar relatórios: {error.message}</p>;

  return (
    <section className='relatorios-section'>
      <RelatoriosHeader />

      <div className='relatorios-conteudo'>
        {obraSelecionada ? (
          abaAtiva === 'custoObra' ? (
            <TabelaCustoObra dados={relatorioCustos} isLoading={carregandoCustos} />
          ) : abaAtiva === 'pagamentos' ? (
            <TabelaSaida dados={relatorioPagamentos} isLoading={carregandoPagamentos} />
          ) : (
            <TabelaNFPendentes dados={nfsPendentes} isLoading={carregandoNFs} />
          )
        ) : (
          <div className='relatorios-vazio'>
            <p>Selecione uma obra para visualizar o relatório</p>
          </div>
        )}
      </div>
    </section>
  );
};

const Relatorios = () => {
  return (
    <RelatoriosProvider>
      <RelatoriosContent />
    </RelatoriosProvider>
  );
};

export default Relatorios;
