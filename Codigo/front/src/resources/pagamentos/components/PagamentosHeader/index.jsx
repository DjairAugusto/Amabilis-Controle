import Dropdown from '../../../../components/ui/Dropdown'
import SearchBar from '../../../../components/ui/SearchBar'
import './PagamentosHeader.css'
import { OPCOES_STATUS_DROPDOWN } from '../../utils/statusNotaFiscal'
import { useObrasTodas } from '../../../obras/hooks/useObras'
import { usePagamentoContext } from '../../hooks/usePagamentoContext'

const PagamentosHeader = () => {
    // 🔴 2. Troque o hook de useObrasCards() para useObrasTodas()
    const { data: obras, isLoading, error } = useObrasTodas(); 
    
    const { 
        searchTerm, setSearchTerm, 
        filtroObra, setFiltroObra, 
        filtroStatus, setFiltroStatus,
        filtroDataVencimento, setFiltroDataVencimento ,
        setPaginaAtual
    } = usePagamentoContext()

    // 🔴 3. Como o useObrasTodas devolve um Array puro, o .map volta a funcionar perfeitamente!
    const obrasDropdown = obras?.map((obra) => obra.nome) || [];
    const opcoesDropdownObras = ['Todas as Obras', ...obrasDropdown];

    const opcoesDropdownStatus = ['Todos os Status', ...OPCOES_STATUS_DROPDOWN];
    
    const opcoesDataVencimento = ['Qualquer Data', 'Esta Semana', 'Próximos 15 dias', 'Próximo Mês', 'Próximos 3 Meses', 'Próximos 6 Meses'];

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPaginaAtual(0);
    }

    const handleSelectObra = (valor) => {
        setFiltroObra(valor === 'Todas as Obras' ? '' : valor);
        setPaginaAtual(0);
    }

    const handleSelectStatus = (valor) => {
        setFiltroStatus(valor === 'Todos os Status' ? '' : valor);
        setPaginaAtual(0);
    }

    const handleSelectData = (valor) => {
        setFiltroDataVencimento(valor === 'Qualquer Data' ? '' : valor);
        setPaginaAtual(0);
    }

    return (
        <div className='pagamento-header'>
            <div className='pagamento-header-textual'>
                <h1 className='pagamentos-titulo'>Pagamentos de NF</h1>
                <p className='pagamentos-subtitulo'>Lançamentos parciais e totais por nota fiscal</p>
            </div>
            <div className='pagamento-header-filters'>
                <SearchBar
                    placeholder="Buscar Fornecedor ou NF"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <Dropdown 
                    placeholder="Todas as Obras" 
                    opcoes={opcoesDropdownObras} 
                    valorDrop={filtroObra}
                    onSelect={handleSelectObra}
                />
                <Dropdown
                    placeholder="Todos os Status"
                    opcoes={opcoesDropdownStatus}
                    valorDrop={filtroStatus}
                    onSelect={handleSelectStatus}
                />
                <Dropdown
                    placeholder="Qualquer Data"
                    opcoes={opcoesDataVencimento}
                    valorDrop={filtroDataVencimento}
                    onSelect={handleSelectData}
                />
            </div>
        </div>
    )
}

export default PagamentosHeader