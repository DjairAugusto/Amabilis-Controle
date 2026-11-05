import { useState, useRef, useEffect } from 'react';
import { Sliders, X } from 'lucide-react';
import './FiltrosNotasFiscais.css';
import Dropdown from '../../../../../components/ui/Dropdown';
import { useNotasFiscaisContext } from '../../../hooks/useNotasFiscaisContext';
import { useFornecedores } from '../../../../fornecedores/hooks/useFornecedores';
import {
    OPCOES_STATUS_DROPDOWN,
    MAPA_STATUS_BACKEND,
    MAPA_STATUS_FRONTEND,
} from '../../../../pagamentos/utils/statusNotaFiscal';

const OPCOES_STATUS_COM_TODOS = ['Todos', ...OPCOES_STATUS_DROPDOWN];
const OPCOES_FORNECEDOR_PLACEHOLDER = 'Todos';

const FiltrosNotasFiscais = () => {
    const {
        filtroNumeroNF, setFiltroNumeroNF,
        filtroDataEmissao, setFiltroDataEmissao,
        filtroDataVencimento, setFiltroDataVencimento,
        filtroStatusNF, setFiltroStatusNF,
        setFiltroFornecedorId,
        filtroFornecedorNome, setFiltroFornecedorNome,
        temFiltrosAtivos, limparFiltros,
        setPaginaAtual,
    } = useNotasFiscaisContext();

    const { data: fornecedores } = useFornecedores();
    const [filtrosAbertos, setFiltrosAbertos] = useState(false);
    const filtrosRef = useRef(null);

    const opcoesFornecedores = [
        OPCOES_FORNECEDOR_PLACEHOLDER,
        ...(fornecedores || [])
            .map((f) => f.nomeFantasia || f.razaoSocial)
            .filter(Boolean)
            .sort(),
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!filtrosRef.current) return;
            if (!filtrosRef.current.contains(event.target)) {
                const dentroDePortal = event.target.closest('.dropdown-menu-portal');
                if (!dentroDePortal) {
                    setFiltrosAbertos(false);
                }
            }
        };

        if (filtrosAbertos) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [filtrosAbertos]);

    // Reseta a página sempre que um filtro muda
    const handleFiltroChange = (setter) => (value) => {
        setter(value);
        setPaginaAtual(0);
    };

    const handleSelectFornecedor = (nome) => {
        if (nome === OPCOES_FORNECEDOR_PLACEHOLDER || !nome) {
            setFiltroFornecedorId(null);
            setFiltroFornecedorNome('');
        } else {
            const found = (fornecedores || []).find(
                (f) => (f.nomeFantasia || f.razaoSocial) === nome
            );
            setFiltroFornecedorId(found ? found.id : null);
            setFiltroFornecedorNome(nome);
        }
        setPaginaAtual(0);
    };

    const handleSelectStatus = (label) => {
        if (label === 'Todos' || !label) {
            setFiltroStatusNF('');
        } else {
            setFiltroStatusNF(MAPA_STATUS_BACKEND[label] || '');
        }
        setPaginaAtual(0);
    };

    const statusLabel = filtroStatusNF
        ? (MAPA_STATUS_FRONTEND[filtroStatusNF] || filtroStatusNF)
        : 'Todos';

    return (
        <div className="filtros-nf-container" ref={filtrosRef}>
            <button
                className={`filtros-nf-btn ${temFiltrosAtivos ? 'tem-filtros' : ''}`}
                onClick={() => setFiltrosAbertos(!filtrosAbertos)}
                title="Filtros avançados"
            >
                <Sliders size={16} />
                <span>Filtros</span>
                {temFiltrosAtivos && <span className="filtros-nf-badge" />}
            </button>

            {filtrosAbertos && (
                <div className="filtros-nf-painel">
                    <div className="filtros-nf-grid">
                        <div className="filtros-nf-campo">
                            <label htmlFor="filtro-nf-numero">Nº NF:</label>
                            <input
                                id="filtro-nf-numero"
                                type="text"
                                placeholder="Ex: 001234"
                                value={filtroNumeroNF}
                                onChange={(e) => handleFiltroChange(setFiltroNumeroNF)(e.target.value)}
                                className="filtros-nf-input"
                            />
                        </div>

                        <div className="filtros-nf-campo">
                            <label htmlFor="filtro-nf-emissao">Data Emissão:</label>
                            <input
                                id="filtro-nf-emissao"
                                type="date"
                                value={filtroDataEmissao}
                                onChange={(e) => handleFiltroChange(setFiltroDataEmissao)(e.target.value)}
                                className="filtros-nf-input"
                            />
                        </div>

                        <div className="filtros-nf-campo">
                            <label htmlFor="filtro-nf-vencimento">Data Vencimento:</label>
                            <input
                                id="filtro-nf-vencimento"
                                type="date"
                                value={filtroDataVencimento}
                                onChange={(e) => handleFiltroChange(setFiltroDataVencimento)(e.target.value)}
                                className="filtros-nf-input"
                            />
                        </div>

                        <div className="filtros-nf-dropdown-wrapper">
                            <Dropdown
                                label="Fornecedor"
                                opcoes={opcoesFornecedores}
                                placeholder="Todos"
                                onSelect={handleSelectFornecedor}
                                valorDrop={filtroFornecedorNome || 'Todos'}
                            />
                        </div>

                        <div className="filtros-nf-dropdown-wrapper">
                            <Dropdown
                                label="Status"
                                opcoes={OPCOES_STATUS_COM_TODOS}
                                placeholder="Todos"
                                onSelect={handleSelectStatus}
                                valorDrop={statusLabel}
                            />
                        </div>
                    </div>

                    {temFiltrosAtivos && (
                        <button className="filtros-nf-limpar-btn" onClick={limparFiltros}>
                            <X size={14} />
                            Limpar Filtros
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default FiltrosNotasFiscais;
