import './RelatoriosHeader.css';
import Botao from '../../../../components/ui/Botao';
import SearchBar from '../../../../components/ui/SearchBar';
import Dropdown from '../../../../components/ui/Dropdown';
import { Download, FileText, ListTree, HelpCircle, ChevronDown, X, Sliders } from 'lucide-react';
import { useRelatoriosContext } from '../../hooks/useRelatoriosContext';
import { useRelatoriosListaObras, useDownloadRelatorioCustosExcel, useDownloadRelatorioPagamentosExcel } from '../../hooks/useRelatoriosData';
import { useFornecedores } from '../../../../resources/fornecedores/hooks/useFornecedores';
import { OPCOES_STATUS_DROPDOWN, MAPA_STATUS_BACKEND, MAPA_STATUS_FRONTEND } from '../../../pagamentos/utils/statusNotaFiscal';
import { useState, useMemo, useRef, useEffect } from 'react';

const OPCOES_STATUS_COM_TODOS = ['Todos', ...OPCOES_STATUS_DROPDOWN];

const RelatoriosHeader = () => {
  const {
    abaAtiva,
    mudarAba,
    obraSelecionada,
    setObraSelecionada,
    dataEmissaoInicio,
    setDataEmissaoInicio,
    dataEmissaoFim,
    setDataEmissaoFim,
    codigoNf,
    setCodigoNf,
    dataEmissao,
    setDataEmissao,
    dataVencimento,
    setDataVencimento,
    fornecedorId,
    setFornecedorId,
    status,
    setStatus,
    codigoTarefa,
    setCodigoTarefa,
    codigoRecurso,
    setCodigoRecurso,
    limparFiltros,
  } = useRelatoriosContext();

  const { data: obras, isLoading: carregandoObras } = useRelatoriosListaObras();
  const { data: fornecedoresData, isLoading: carregandoFornecedores } = useFornecedores();
  const downloadCustosExcel = useDownloadRelatorioCustosExcel();
  const downloadPagamentosExcel = useDownloadRelatorioPagamentosExcel();

  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [buscaObra, setBuscaObra] = useState('');
  const [filtrosAvancadosAbertos, setFiltrosAvancadosAbertos] = useState(false);

  const filtrosRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!filtrosRef.current) return;

      const isClickInside = filtrosRef.current.contains(event.target);
      const isClickInPortal = !document.body.contains(filtrosRef.current);

      if (!isClickInside && !isClickInPortal) {
        const closestDropdown = event.target.closest('[role="listbox"], [role="option"], .dropdown, ul[role="listbox"]');
        const closestMenuItem = event.target.closest('[role="menuitem"], li');

        if (!closestDropdown && !closestMenuItem) {
          setFiltrosAvancadosAbertos(false);
        }
      }
    };

    if (filtrosAvancadosAbertos) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [filtrosAvancadosAbertos]);

  const handleExport = () => {
    if (!obraSelecionada?.id) {
      alert('Selecione uma obra para exportar');
      return;
    }

    if (abaAtiva === 'custoObra') {
      downloadCustosExcel.mutate(obraSelecionada.id);
    } else {
      downloadPagamentosExcel.mutate(obraSelecionada.id);
    }
  };

  const obrasFiltradas = obras ? obras.filter(obra =>
    (obra.nome || '').toLowerCase().includes(buscaObra.toLowerCase())
  ) : [];

  const nomeObraSelecionada = obraSelecionada?.nome || 'Selecione uma obra';

  const opcoesCompetenciasytemFornecedores = useMemo(() => {
    if (!fornecedoresData || fornecedoresData.length === 0) return [];
    return fornecedoresData
      .map(f => f.nomeFantasia || f.razaoSocial)
      .filter(Boolean)
      .sort();
  }, [fornecedoresData]);

  const isAbaNFPendentes = abaAtiva === 'nfPendentes';

  const handleSelectStatus = (label) => {
    if (label === 'Todos' || !label) {
      setStatus('');
    } else {
      setStatus(MAPA_STATUS_BACKEND[label] || '');
    }
  };

  const statusLabel = status
    ? (MAPA_STATUS_FRONTEND[status] || status)
    : 'Todos';

  // Calcular filtros ativos baseado no tipo de relatório ativo
  const temFiltrosAtivos = () => {
    const filtrosComuns = codigoNf || dataEmissao || dataVencimento || dataEmissaoInicio || dataEmissaoFim;
    if (abaAtiva === 'pagamentos') return filtrosComuns;
    if (isAbaNFPendentes) return filtrosComuns || fornecedorId || status;
    return filtrosComuns || fornecedorId || codigoTarefa || codigoRecurso;
  };

  return (
    <div className="relatorios-header">
      <div className='relatorios-header-texto'>
        <h1 className='relatorios-titulo'>Relatórios</h1>
        <p className='relatorios-subtitulo'>Relatórios gerados de acordo com dados utilizados</p>
      </div>

      <div className="relatorios-controls-wrapper">
        <div className="relatorios-controls">
          <div className="relatorios-tabs-toggle">
            <button
              className={`relatorios-toggle-option ${abaAtiva === 'custoObra' ? 'active' : ''}`}
              onClick={() => mudarAba('custoObra')}
              title="Custo de Obra"
            >
              <FileText size={18} />
              <span>Custo de Obra</span>
            </button>
            <div className="relatorios-toggle-slider"></div>
            <button
              className={`relatorios-toggle-option ${abaAtiva === 'pagamentos' ? 'active' : ''}`}
              onClick={() => mudarAba('pagamentos')}
              title="Relatório de Pagamentos"
            >
              <ListTree size={18} />
              <span>Relatório de Pagamentos</span>
            </button>
            <button
              className={`relatorios-toggle-option ${abaAtiva === 'nfPendentes' ? 'active' : ''}`}
              onClick={() => mudarAba('nfPendentes')}
              title="NFs Pendentes de Pagamento"
            >
              <HelpCircle size={18} />
              <span>NFs Pendentes</span>
            </button>
          </div>

          {!isAbaNFPendentes && (
            <div className="relatorios-actions">
              <Botao color="export-button" aoClicar={handleExport} disabled={downloadCustosExcel.isPending || downloadPagamentosExcel.isPending}>
                <Download size={20} /> {downloadCustosExcel.isPending || downloadPagamentosExcel.isPending ? 'Baixando...' : 'Exportar .XLSX'}
              </Botao>
            </div>
          )}
        </div>

        <div className="relatorios-dropdown-section">
          <div className="relatorios-obra-label">
            <label>Obra:</label>
            <button
              className="relatorios-dropdown-trigger"
              onClick={() => setDropdownAberto(!dropdownAberto)}
            >
              {nomeObraSelecionada}
              <ChevronDown size={18} />
            </button>
          </div>

          <div className="relatorios-filtros-data">
            <div className="relatorios-data-input-group">
              <label htmlFor="data-inicio">De:</label>
              <input
                id="data-inicio"
                type="date"
                value={dataEmissaoInicio}
                onChange={(e) => setDataEmissaoInicio(e.target.value)}
                className="relatorios-data-input"
              />
            </div>
            <div className="relatorios-data-input-group">
              <label htmlFor="data-fim">Até:</label>
              <input
                id="data-fim"
                type="date"
                value={dataEmissaoFim}
                onChange={(e) => setDataEmissaoFim(e.target.value)}
                className="relatorios-data-input"
              />
            </div>
          </div>

          <div className="relatorios-filtros-container" ref={filtrosRef}>
            <button
              className={`relatorios-filtros-avancados-btn ${temFiltrosAtivos() ? 'tem-filtros' : ''}`}
              onClick={() => setFiltrosAvancadosAbertos(!filtrosAvancadosAbertos)}
              title="Filtros avançados"
            >
              <Sliders size={18} />
              <span>Filtros</span>
              {temFiltrosAtivos() && <span className="filtros-badge"></span>}
            </button>

            {filtrosAvancadosAbertos && (
              <div className="relatorios-filtros-avancados">
                <div className="relatorios-filtros-grid">
                  <div className="relatorios-filtro-input">
                    <label htmlFor="filtro-nf">Nº NF:</label>
                    <input
                      id="filtro-nf"
                      type="text"
                      placeholder="Ex: NF-001234"
                      value={codigoNf}
                      onChange={(e) => setCodigoNf(e.target.value)}
                      className="relatorios-filtro-input-campo"
                    />
                  </div>

                  <div className="relatorios-filtro-input">
                    <label htmlFor="filtro-emissao">Data Emissão:</label>
                    <input
                      id="filtro-emissao"
                      type="date"
                      value={dataEmissao}
                      onChange={(e) => setDataEmissao(e.target.value)}
                      className="relatorios-filtro-input-campo"
                    />
                  </div>

                  <div className="relatorios-filtro-input">
                    <label htmlFor="filtro-vencimento">Data Vencimento:</label>
                    <input
                      id="filtro-vencimento"
                      type="date"
                      value={dataVencimento}
                      onChange={(e) => setDataVencimento(e.target.value)}
                      className="relatorios-filtro-input-campo"
                    />
                  </div>

                  {abaAtiva === 'custoObra' && (
                    <>
                      <div className="relatorios-filtro-dropdown-container">
                        <Dropdown
                          label="Fornecedor"
                          opcoes={opcoesCompetenciasytemFornecedores}
                          placeholder="Selecione..."
                          onSelect={(value) => setFornecedorId(value)}
                          valorDrop={fornecedorId}
                        />
                      </div>

                      <div className="relatorios-filtro-input">
                        <label htmlFor="filtro-tarefa">Código Tarefa:</label>
                        <input
                          id="filtro-tarefa"
                          type="text"
                          placeholder="Ex: T01"
                          value={codigoTarefa}
                          onChange={(e) => setCodigoTarefa(e.target.value)}
                          className="relatorios-filtro-input-campo"
                        />
                      </div>

                      <div className="relatorios-filtro-input">
                        <label htmlFor="filtro-recurso">Código Recurso:</label>
                        <input
                          id="filtro-recurso"
                          type="text"
                          placeholder="Ex: R01"
                          value={codigoRecurso}
                          onChange={(e) => setCodigoRecurso(e.target.value)}
                          className="relatorios-filtro-input-campo"
                        />
                      </div>
                    </>
                  )}

                  {isAbaNFPendentes && (
                    <>
                      <div className="relatorios-filtro-dropdown-container">
                        <Dropdown
                          label="Fornecedor"
                          opcoes={opcoesCompetenciasytemFornecedores}
                          placeholder="Selecione..."
                          onSelect={(value) => setFornecedorId(value)}
                          valorDrop={fornecedorId}
                        />
                      </div>

                      <div className="relatorios-filtro-dropdown-container">
                        <Dropdown
                          label="Status"
                          opcoes={OPCOES_STATUS_COM_TODOS}
                          placeholder="Todos"
                          onSelect={handleSelectStatus}
                          valorDrop={statusLabel}
                        />
                      </div>
                    </>
                  )}
                </div>

                {temFiltrosAtivos() && (
                  <button
                    className="relatorios-limpar-filtros-btn"
                    onClick={limparFiltros}
                  >
                    <X size={16} /> Limpar Filtros
                  </button>
                )}
              </div>
            )}
          </div>

          {dropdownAberto && (
            <div className="relatorios-dropdown-menu">
              <SearchBar
                placeholder="Buscar obra por nome"
                value={buscaObra}
                onChange={(e) => setBuscaObra(e.target.value)}
              />
              <div className="relatorios-dropdown-lista">
                {carregandoObras ? (
                  <div className="relatorios-dropdown-vazio">Carregando obras...</div>
                ) : obrasFiltradas.length > 0 ? (
                  obrasFiltradas.map(obra => (
                    <button
                      key={obra.id}
                      className={`relatorios-dropdown-item ${obraSelecionada?.id === obra.id ? 'selecionado' : ''}`}
                      onClick={() => {
                        setObraSelecionada(obra);
                        setDropdownAberto(false);
                        setBuscaObra('');
                      }}
                    >
                      {obra.nome}
                    </button>
                  ))
                ) : (
                  <div className="relatorios-dropdown-vazio">Nenhuma obra encontrada</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RelatoriosHeader;
